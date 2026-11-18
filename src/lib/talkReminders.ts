import { useCallback, useEffect, useRef, useState } from 'react';
import type { ScheduleItem } from '../data/conference';
import { parseSessionTimeRange, REMINDER_OFFSET_MINUTES } from './calendar';

const SAVED_REMINDERS_KEY = 'stjarnfall-talk-reminders';
const FIRED_REMINDERS_KEY = 'stjarnfall-talk-reminders-fired';
const POLL_INTERVAL_MS = 15_000;

export type BrowserNotificationPermission =
  NotificationPermission | 'unsupported';

export interface ActiveReminderNotice {
  id: string;
  title: string;
  body: string;
  isTest: boolean;
}

function readStoredIdList(storageKey: string): string[] {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === 'string');
    }
  } catch {
    // Ignore storage errors in restricted contexts
  }
  return [];
}

function writeStoredIdList(storageKey: string, ids: string[]): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(ids));
  } catch {
    // Ignore storage errors in restricted contexts
  }
}

export function getBrowserNotificationPermission(): BrowserNotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  return window.Notification.permission;
}

async function requestPermissionSafely(): Promise<BrowserNotificationPermission> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  if (window.Notification.permission !== 'default') {
    return window.Notification.permission;
  }

  try {
    const result = await window.Notification.requestPermission();
    return result;
  } catch {
    return getBrowserNotificationPermission();
  }
}

function dispatchSystemNotification(
  title: string,
  body: string,
  tag: string
): boolean {
  if (
    typeof window === 'undefined' ||
    !('Notification' in window) ||
    window.Notification.permission !== 'granted'
  ) {
    return false;
  }

  try {
    new window.Notification(title, {
      body,
      tag,
    });
    return true;
  } catch {
    return false;
  }
}

interface UseTalkRemindersOptions {
  formatNotificationTitle: (title: string) => string;
  formatNotificationBody: (
    time: string,
    room: string,
    speaker: string
  ) => string;
  cloudSavedIds?: string[] | null;
  onSyncSavedIds?: (ids: string[]) => Promise<void> | void;
}

export function useTalkReminders(
  scheduleItems: ScheduleItem[],
  options: UseTalkRemindersOptions
) {
  const [savedIds, setSavedIds] = useState<string[]>(() =>
    readStoredIdList(SAVED_REMINDERS_KEY)
  );
  const [firedIds, setFiredIds] = useState<string[]>(() =>
    readStoredIdList(FIRED_REMINDERS_KEY)
  );
  const [permission, setPermission] = useState<BrowserNotificationPermission>(
    () => getBrowserNotificationPermission()
  );
  const [activeNotice, setActiveNotice] = useState<ActiveReminderNotice | null>(
    null
  );

  const optionsRef = useRef(options);
  optionsRef.current = options;

  const savedIdsRef = useRef(savedIds);
  savedIdsRef.current = savedIds;

  const firedIdsRef = useRef(firedIds);
  firedIdsRef.current = firedIds;

  useEffect(() => {
    if (options.cloudSavedIds) {
      setSavedIds(options.cloudSavedIds);
    }
  }, [options.cloudSavedIds]);

  useEffect(() => {
    writeStoredIdList(SAVED_REMINDERS_KEY, savedIds);
  }, [savedIds]);

  useEffect(() => {
    writeStoredIdList(FIRED_REMINDERS_KEY, firedIds);
  }, [firedIds]);

  const checkDueReminders = useCallback(() => {
    const currentSaved = savedIdsRef.current;
    if (currentSaved.length === 0) return;

    const nowMs = Date.now();
    const offsetMs = REMINDER_OFFSET_MINUTES * 60 * 1000;
    const newlyFired: string[] = [];

    for (const item of scheduleItems) {
      if (!currentSaved.includes(item.id)) continue;
      if (firedIdsRef.current.includes(item.id)) continue;

      const { startUtc, endUtc } = parseSessionTimeRange(item.time);
      const remindAtMs = startUtc.getTime() - offsetMs;

      if (nowMs >= remindAtMs && nowMs < endUtc.getTime()) {
        const title = optionsRef.current.formatNotificationTitle(item.title);
        const body = optionsRef.current.formatNotificationBody(
          item.time,
          item.room,
          item.speaker
        );

        dispatchSystemNotification(
          title,
          body,
          `stjarnfall-reminder-${item.id}`
        );
        setActiveNotice({
          id: item.id,
          title,
          body,
          isTest: false,
        });
        newlyFired.push(item.id);
      }
    }

    if (newlyFired.length > 0) {
      setFiredIds((prev) => Array.from(new Set([...prev, ...newlyFired])));
    }
  }, [scheduleItems]);

  useEffect(() => {
    checkDueReminders();
    const intervalId = window.setInterval(checkDueReminders, POLL_INTERVAL_MS);
    return () => window.clearInterval(intervalId);
  }, [checkDueReminders, savedIds]);

  useEffect(() => {
    const syncPermission = () => {
      setPermission(getBrowserNotificationPermission());
    };
    window.addEventListener('focus', syncPermission);
    return () => window.removeEventListener('focus', syncPermission);
  }, []);

  const requestPermission = useCallback(async () => {
    const next = await requestPermissionSafely();
    setPermission(next);
    return next;
  }, []);

  const toggleReminder = useCallback(async (itemId: string) => {
    const currentlySaved = savedIdsRef.current.includes(itemId);

    if (currentlySaved) {
      const nextIds = savedIdsRef.current.filter((id) => id !== itemId);
      setSavedIds(nextIds);
      setFiredIds((prev) => prev.filter((id) => id !== itemId));
      void optionsRef.current.onSyncSavedIds?.(nextIds);
      return;
    }

    const nextIds = savedIdsRef.current.includes(itemId)
      ? savedIdsRef.current
      : [...savedIdsRef.current, itemId];
    setSavedIds(nextIds);
    void optionsRef.current.onSyncSavedIds?.(nextIds);

    if (getBrowserNotificationPermission() === 'default') {
      const next = await requestPermissionSafely();
      setPermission(next);
    }
  }, []);

  const clearAllReminders = useCallback(() => {
    setSavedIds([]);
    setFiredIds([]);
    void optionsRef.current.onSyncSavedIds?.([]);
  }, []);

  const sendTestNotification = useCallback(async () => {
    if (getBrowserNotificationPermission() === 'default') {
      const next = await requestPermissionSafely();
      setPermission(next);
    }

    const targetItem =
      scheduleItems.find((item) => savedIdsRef.current.includes(item.id)) ??
      scheduleItems[0];

    if (!targetItem) return;

    const title = optionsRef.current.formatNotificationTitle(targetItem.title);
    const body = optionsRef.current.formatNotificationBody(
      targetItem.time,
      targetItem.room,
      targetItem.speaker
    );

    dispatchSystemNotification(
      title,
      body,
      `stjarnfall-reminder-test-${targetItem.id}`
    );

    setActiveNotice({
      id: `test-${targetItem.id}-${Date.now()}`,
      title,
      body,
      isTest: true,
    });
  }, [scheduleItems]);

  const dismissNotice = useCallback(() => {
    setActiveNotice(null);
  }, []);

  return {
    savedIds,
    permission,
    activeNotice,
    toggleReminder,
    clearAllReminders,
    requestPermission,
    sendTestNotification,
    dismissNotice,
  };
}
