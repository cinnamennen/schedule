/**
 * Database service
 * Handles all interactions with LowDB
 */

import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join } from 'path';
import { homedir } from 'os';
import type { DbSchema } from '../types';

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

  // Add more methods here as we implement features
}

// Export singleton instance
export const dbService = DatabaseService.getInstance();
