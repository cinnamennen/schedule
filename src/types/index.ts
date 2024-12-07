/**
 * Core type definitions
 */

export interface Job {
  id: string;
  name: string;
  duration: number; // stored in minutes
  createdAt: string;
  updatedAt: string;
}

export interface DowntimePattern {
  id: string;
  type: 'daily' | 'weekly' | 'oneoff';
  startTime: string; // ISO string for oneoff, HH:mm for others
  endTime: string; // ISO string for oneoff, HH:mm for others
  // For weekly patterns
  daysOfWeek?: number[]; // 0-6, 0 is Sunday
  createdAt: string;
  updatedAt: string;
}

export interface MachineConfig {
  setupTime: number; // in minutes
  teardownTime: number; // in minutes
  updatedAt: string;
}

// Database schema
export interface DbSchema {
  jobs: Job[];
  downtimePetterns: DowntimePattern[];
  machineConfig: MachineConfig;
}
