interface IScheduler {
  start(): void;
  stop(): void;
  addJob(
    func: (jobId: number, args: unknown) => unknown,
    startAt: number,
    args?: unknown
  ): number;
  removeJob(jobId: number): void;
}

interface IJobStore {
  push(job: INewJob): number;
  pop(jobId: number): boolean;
  find(jobId: number): IJob | undefined;
  filter(
    predicate: (value: IJob, index: number, array: IJob[]) => unknown
  ): IJob[];
}

class MemoryJobStore implements IJobStore {
  private jobs: IJob[] = [];
  push(job: INewJob): number {
    job.id = this.jobs.length;
    this.jobs.push(job as IJob);
    return this.jobs.length - 1;
  }
  pop(jobId: number): boolean {
    const index = this.jobs.findIndex(job => job.id === jobId);
    if (index === -1) {
      return false;
    }
    this.jobs.splice(index, 1);
    return true;
  }
  find(jobId: number): IJob | undefined {
    return this.jobs.find((j: IJob) => j.id === jobId);
  }
  filter(
    predicate: (value: IJob, index: number, array: IJob[]) => unknown
  ): IJob[] {
    return this.jobs.filter(predicate);
  }
}
interface IJob {
  id: number;
  func: (jobId: number, args: unknown) => unknown;
  startAt: number;
  args?: unknown;
}
interface INewJob extends Partial<IJob> {
  func: (jobId: number, args: unknown) => unknown;
  startAt: number;
  args?: unknown;
}
type SetIntervalSchedulerConfig = {
  interval: number;
  jobStore: IJobStore;
};
export class SetIntervalScheduler implements IScheduler {
  private jobs: IJob[] = [];
  private jobStore: IJobStore = new MemoryJobStore();
  private intervalId: NodeJS.Timeout | undefined;
  private interval = 1000;
  constructor(config?: SetIntervalSchedulerConfig) {
    if (!config) {
      return;
    }
    this.interval = config.interval;
    this.jobStore = config.jobStore;
  }
  public start(): void {
    this.intervalId = setInterval(() => {
      const jobs = this.jobStore.filter(job => job.startAt <= +new Date());
      jobs.forEach(job => {
        job.func(job.id, job.args || {});
        this.jobStore.pop(job.id);
      });
    }, this.interval);
  }
  public stop(): void {
    clearInterval(this.intervalId);
  }
  public addJob(
    func: (jobId: number, args?: any) => unknown,
    startAt: number,
    args?: unknown
  ): number {
    const job: INewJob = {
      func,
      startAt,
      args,
    };
    const id = this.jobStore.push(job);
    return id;
  }
  public removeJob(jobId: number): void {
    this.jobs = this.jobs.filter(job => job.id !== jobId);
  }
}
