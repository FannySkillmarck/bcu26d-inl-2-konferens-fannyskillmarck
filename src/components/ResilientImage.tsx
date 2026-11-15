import { useState } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackLabel?: string;
  priority?: boolean;
}

export function ResilientImage({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackLabel,
  priority = false,
}: ResilientImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <figure
        aria-label={alt}
        className={`flex flex-col items-center justify-center gap-3 p-6 text-center bg-[var(--bg-subtle)] text-[var(--text-muted)] ${className}`}
      >
        <Compass className="w-7 h-7 opacity-60" aria-hidden="true" />
        <figcaption className="text-xs font-medium max-w-[22ch]">
          {fallbackLabel || alt}
        </figcaption>
      </figure>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
}
