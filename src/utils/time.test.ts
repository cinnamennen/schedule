import { describe, it, expect } from 'vitest';
import { parseDuration, formatDuration } from './time';

describe('time utils', () => {
  describe('parseDuration', () => {
    it('should parse hours and minutes', () => {
      expect(parseDuration('2h30m')).toBe(9000); // 2.5 hours in seconds
    });

    it('should parse hours only', () => {
      expect(parseDuration('3h')).toBe(10800); // 3 hours in seconds
    });

    it('should parse minutes only', () => {
      expect(parseDuration('45m')).toBe(2700); // 45 minutes in seconds
    });

    it('should handle whitespace', () => {
      expect(parseDuration('2h 30m')).toBe(9000);
    });

    it('should throw on invalid format', () => {
      expect(() => parseDuration('invalid')).toThrow();
    });
  });

  describe('formatDuration', () => {
    it('should format hours and minutes', () => {
      expect(formatDuration(9000)).toBe('2h 30m');
    });

    it('should format hours only', () => {
      expect(formatDuration(7200)).toBe('2h');
    });

    it('should format minutes only', () => {
      expect(formatDuration(1800)).toBe('30m');
    });

    it('should handle zero duration', () => {
      expect(formatDuration(0)).toBe('0m');
    });
  });
});
