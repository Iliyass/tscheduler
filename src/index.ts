interface IScheduler {
  start(): void;
  stop(): void;
  addJob(
    func: (jobId: number, ...args: unknown[]) => unknown,
    startAt: Date,
    args: unknown
  ): number;
  removeJob(jobId: number): void;
}

interface IJob {
  id: number;
  func: (jobId: number, args: unknown) => unknown;
  startAt: Date;
  args?: unknown;
}
export class Scheduler implements IScheduler {
  private jobs: IJob[] = [];
  private intervalId: NodeJS.Timeout | undefined;
  public start(): void {
    this.intervalId = setInterval(() => {
      this.jobs.forEach(job => {
        if (job.startAt <= new Date()) {
          job.func(job.id, job.args || {});
          this.removeJob(job.id);
        }
      });
    }, 1000);
  }
  public stop(): void {
    clearInterval(this.intervalId);
  }
  public addJob(
    func: (jobId: number, args?: any) => unknown,
    startAt: Date,
    args?: unknown
  ): number {
    const job: IJob = {
      id: this.jobs.length,
      func,
      startAt,
      args,
    };
    this.jobs.push(job);
    return job.id;
  }
  public removeJob(jobId: number): void {
    this.jobs = this.jobs.filter(job => job.id !== jobId);
  }
}
