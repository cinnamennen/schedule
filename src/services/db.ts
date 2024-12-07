/**
 * Database service
 * Handles all interactions with LowDB
 * 
 * Note: While this service currently uses local storage, the interface is designed
 * to be implementation-agnostic. If printer system APIs become available in the future,
 * this could potentially be adapted, but we make no assumptions about such capabilities.
 */

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { homedir } from 'os';
import { randomUUID } from 'crypto';
import type { DbSchema, Job } from '../types';

// Default configuration
const DEFAULT_CONFIG: DbSchema = {
  jobs: [],
  downtimePetterns: [],
  machineConfig: {
    setupTime: 15, // 15 minutes default setup time
    teardownTime: 15, // 15 minutes default teardown time
    updatedAt: new Date().toISOString(),
  },
};

/**
 * Database service using local storage
 * Interface is kept generic to maintain flexibility for future enhancements,
 * but core functionality assumes local operation
 */
class DatabaseService {
  private db: Low<DbSchema>;
  private static instance: DatabaseService;

  private constructor() {
    const dbPath = join(homedir(), '.schedule-cli', 'db.json');
    const adapter = new JSONFile<DbSchema>(dbPath);
    this.db = new Low(adapter, DEFAULT_CONFIG);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async initialize(): Promise<void> {
    await this.db.read();
    // Ensure default structure
    this.db.data = {
      ...DEFAULT_CONFIG,
      ...this.db.data,
    };
    await this.db.write();
  }

  // Job Management Methods

  public async addJob(name: string, duration: number): Promise<Job> {
    const job: Job = {
      id: randomUUID(),
      name,
      duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.db.data.jobs.push(job);
    await this.db.write();
    return job;
  }

  public async getJobs(): Promise<Job[]> {
    return this.db.data.jobs;
  }

  public async getJob(id: string): Promise<Job | undefined> {
    return this.db.data.jobs.find((job) => job.id === id);
  }

  public async updateJob(id: string, updates: Partial<Pick<Job, 'name' | 'duration'>>): Promise<Job> {
    const jobIndex = this.db.data.jobs.findIndex((job) => job.id === id);
    if (jobIndex === -1) {
      throw new Error(`Job not found: ${id}`);
    }

    const job = this.db.data.jobs[jobIndex];
    const updatedJob: Job = {
      ...job,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    this.db.data.jobs[jobIndex] = updatedJob;
    await this.db.write();
    return updatedJob;
  }

  public async removeJob(id: string): Promise<void> {
    const jobIndex = this.db.data.jobs.findIndex((job) => job.id === id);
    if (jobIndex === -1) {
      throw new Error(`Job not found: ${id}`);
    }

    this.db.data.jobs.splice(jobIndex, 1);
    await this.db.write();
  }
}

// Export singleton instance
export const dbService = DatabaseService.getInstance();
