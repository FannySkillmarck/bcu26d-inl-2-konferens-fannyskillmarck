import type { ScheduleItem } from '../data/conference';

const EVENT_YEAR = 2027;
const EVENT_MONTH_INDEX = 9; // October (0-indexed)
const EVENT_DAY = 20;
// October 20, 2027 is in CEST (UTC+2) in Europe/Stockholm
const STOCKHOLM_UTC_OFFSET_HOURS = 2;

function parseSessionTimeRange(timeStr: string): {
  startUtc: Date;
  endUtc: Date;
} {
  const match = timeStr.match(/(\d{2}):(\d{2})\s*[–-]\s*(\d{2}):(\d{2})/);
  const startHour = match ? Number(match[1]) : 9;
  const startMin = match ? Number(match[2]) : 0;
  const endHour = match ? Number(match[3]) : 10;
  const endMin = match ? Number(match[4]) : 0;

  const startUtc = new Date(
    Date.UTC(
      EVENT_YEAR,
      EVENT_MONTH_INDEX,
      EVENT_DAY,
      startHour - STOCKHOLM_UTC_OFFSET_HOURS,
      startMin,
      0
    )
  );
  const endUtc = new Date(
    Date.UTC(
      EVENT_YEAR,
      EVENT_MONTH_INDEX,
      EVENT_DAY,
      endHour - STOCKHOLM_UTC_OFFSET_HOURS,
      endMin,
      0
    )
  );

  return { startUtc, endUtc };
}

function formatUtcCompact(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, '')
    .replace(/\.\d{3}Z$/, 'Z');
}

function escapeIcsText(value: string): string {
  return value
    .replace(/\\/g, '\\\\')
    .replace(/\r?\n/g, '\\n')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;');
}

function buildEventFields(item: ScheduleItem) {
  const { startUtc, endUtc } = parseSessionTimeRange(item.time);
  const summary = `${item.title} — ${item.speaker} (Stjärnfall 2027)`;
  const location = `${item.room}, Münchenbryggeriet, Torkel Knutssonsgatan 2, Stockholm`;
  const details = `${item.description}\n\nSpeaker: ${item.speaker}\nSymposium: Stjärnfall 2027`;

  return { startUtc, endUtc, summary, location, details };
}

export function buildGoogleCalendarUrl(item: ScheduleItem): string {
  const { startUtc, endUtc, summary, location, details } =
    buildEventFields(item);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: summary,
    dates: `${formatUtcCompact(startUtc)}/${formatUtcCompact(endUtc)}`,
    ctz: 'Europe/Stockholm',
    location,
    details,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function buildOutlookCalendarUrl(item: ScheduleItem): string {
  const { startUtc, endUtc, summary, location, details } =
    buildEventFields(item);
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: summary,
    startdt: startUtc.toISOString(),
    enddt: endUtc.toISOString(),
    location,
    body: details,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function downloadIcsEvent(item: ScheduleItem): void {
  const { startUtc, endUtc, summary, location, details } =
    buildEventFields(item);
  const nowStamp = formatUtcCompact(new Date());

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Stjarnfall 2027//Symposium Schedule//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:stjarnfall-2027-${item.id}@stjarnfall.se`,
    `DTSTAMP:${nowStamp}`,
    `DTSTART:${formatUtcCompact(startUtc)}`,
    `DTEND:${formatUtcCompact(endUtc)}`,
    `SUMMARY:${escapeIcsText(summary)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(details)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  const blob = new Blob([lines.join('\r\n') + '\r\n'], {
    type: 'text/calendar;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `stjarnfall-2027-${item.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
