import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import mockFs from 'mock-fs';
import { dbService } from './db';

describe('DatabaseService', () => {
  beforeEach(async () => {
    // Mock filesystem before each test
    mockFs({
      '/tmp/.schedule-cli': {
        'db.json': JSON.stringify({
          jobs: [],
          downtimePetterns: [],
          machineConfig: {
            setupTime: 15,
            teardownTime: 15,
            updatedAt: new Date().toISOString(),
          },
        }),
      },
    });

    // Initialize DB with mocked filesystem
    await dbService.initialize();
  });

  afterEach(() => {
    // Restore real filesystem after each test
    mockFs.restore();
  });

  describe('job management', () => {
    it('should add a job', async () => {
      const job = await dbService.addJob('Test Job', 3600);
      expect(job.name).toBe('Test Job');
      expect(job.duration).toBe(3600);
      expect(job.id).toBeDefined();
      expect(job.createdAt).toBeDefined();
      expect(job.updatedAt).toBeDefined();
    });

    it('should list jobs', async () => {
      await dbService.addJob('Job 1', 3600);
      await dbService.addJob('Job 2', 7200);

      const jobs = await dbService.getJobs();
      expect(jobs).toHaveLength(2);
      expect(jobs[0].name).toBe('Job 1');
      expect(jobs[1].name).toBe('Job 2');
    });

    it('should get a job by id', async () => {
      const job = await dbService.addJob('Test Job', 3600);
      const found = await dbService.getJob(job.id);
      expect(found).toBeDefined();
      expect(found?.name).toBe('Test Job');
    });

    it('should update a job', async () => {
      const job = await dbService.addJob('Test Job', 3600);
      const updated = await dbService.updateJob(job.id, {
        name: 'Updated Job',
        duration: 7200,
      });

      expect(updated.name).toBe('Updated Job');
      expect(updated.duration).toBe(7200);
      expect(updated.updatedAt).not.toBe(job.updatedAt);
    });

    it('should remove a job', async () => {
      const job = await dbService.addJob('Test Job', 3600);
      await dbService.removeJob(job.id);
      const found = await dbService.getJob(job.id);
      expect(found).toBeUndefined();
    });

    it('should throw when updating non-existent job', async () => {
      await expect(dbService.updateJob('non-existent', { name: 'Test' })).rejects.toThrow(
        'Job not found',
      );
    });

    it('should throw when removing non-existent job', async () => {
      await expect(dbService.removeJob('non-existent')).rejects.toThrow('Job not found');
    });
  });
});
