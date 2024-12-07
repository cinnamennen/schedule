/**
 * Time utilities
 * Functions for handling time conversions and calculations
 */

import parseDuration from 'parse-duration';

/**
 * Convert a duration string to minutes
 * @param duration Duration string (e.g., "1h30m", "45m", "2h")
 * @returns number of minutes
 */
export function parseToMinutes(duration: string): number {
  const ms = parseDuration(duration);
  if (ms === null) {
    throw new Error(`Invalid duration format: ${duration}`);
  }
  return Math.round(ms / (1000 * 60)); // Convert ms to minutes
}

/**
 * Format minutes into a human readable string
 * @param minutes Number of minutes
 * @returns Formatted string (e.g., "1h 30m")
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (hours === 0) return `${remainingMinutes}m`;
  if (remainingMinutes === 0) return `${hours}h`;
  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Parse time string to 24h format
 * @param time Time string (e.g., "2:30 PM", "14:30")
 * @returns 24h format string (HH:mm)
 */
export function parseTo24h(time: string): string {
  const date = new Date(`1970-01-01 ${time}`);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid time format: ${time}`);
  }
  return date.toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
  });
} 