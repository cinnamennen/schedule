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
import { mkdir } from 'fs/promises';
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

const DB_DIR = join(homedir(), '.schedule-cli');
const DB_PATH = join(DB_DIR, 'db.json');

class DatabaseError extends Error {
  constructor(
    message: string,
    public cause?: Error,
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

/**
 * Database service using local storage
 * Interface is kept generic to maintain flexibility for future enhancements,
 * but core functionality assumes local operation
 */
class DatabaseService {
  private db: Low<DbSchema>;
  private static instance: DatabaseService;
  private initialized = false;

  private constructor() {
    const adapter = new JSONFile<DbSchema>(DB_PATH);
    this.db = new Low(adapter, DEFAULT_CONFIG);
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }

  public async initialize(): Promise<void> {
    try {
      // Ensure database directory exists
      await mkdir(DB_DIR, { recursive: true });

      // Initialize database with defaults if it doesn't exist
      try {
        await this.db.read();
      } catch (error) {
        // If file doesn't exist or is invalid, use defaults
        this.db.data = DEFAULT_CONFIG;
        await this.db.write();
      }

      // Ensure all required properties exist
      this.db.data = {
        ...DEFAULT_CONFIG,
        ...this.db.data,
        jobs: this.db.data?.jobs ?? [],
        downtimePetterns: this.db.data?.downtimePetterns ?? [],
        machineConfig: {
          ...DEFAULT_CONFIG.machineConfig,
          ...this.db.data?.machineConfig,
        },
      };

      await this.db.write();
      this.initialized = true;
    } catch (error) {
      throw new DatabaseError(
        'Failed to initialize database',
        error instanceof Error ? error : undefined,
      );
    }
  }

  // Job Management Methods

  public async addJob(name: string, duration: number): Promise<Job> {
    await this.ensureInitialized();

    const job: Job = {
      id: randomUUID(),
      name,
      duration,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      this.db.data.jobs.push(job);
      await this.db.write();
      return job;
    } catch (error) {
      throw new DatabaseError('Failed to add job', error instanceof Error ? error : undefined);
    }
  }

  public async getJobs(): Promise<Job[]> {
    await this.ensureInitialized();
    return this.db.data.jobs;
  }

  public async getJob(id: string): Promise<Job | undefined> {
    await this.ensureInitialized();
    return this.db.data.jobs.find((job) => job.id === id);
  }

  public async updateJob(
    id: string,
    updates: Partial<Pick<Job, 'name' | 'duration'>>,
  ): Promise<Job> {
    await this.ensureInitialized();

    const jobIndex = this.db.data.jobs.findIndex((job) => job.id === id);
    if (jobIndex === -1) {
      throw new DatabaseError(`Job not found: ${id}`);
    }

    try {
      const job = this.db.data.jobs[jobIndex];
      const updatedJob: Job = {
        ...job,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      this.db.data.jobs[jobIndex] = updatedJob;
      await this.db.write();
      return updatedJob;
    } catch (error) {
      throw new DatabaseError('Failed to update job', error instanceof Error ? error : undefined);
    }
  }

  public async removeJob(id: string): Promise<void> {
    await this.ensureInitialized();

    const jobIndex = this.db.data.jobs.findIndex((job) => job.id === id);
    if (jobIndex === -1) {
      throw new DatabaseError(`Job not found: ${id}`);
    }

    try {
      this.db.data.jobs.splice(jobIndex, 1);
      await this.db.write();
    } catch (error) {
      throw new DatabaseError('Failed to remove job', error instanceof Error ? error : undefined);
    }
  }
}

// Export singleton instance
export const dbService = DatabaseService.getInstance();
