import {expect, test, jest} from '@jest/globals';
import {SetIntervalScheduler} from '../index';
jest.useFakeTimers();

test('add new job Scheduler', () => {
  const scheduler = new SetIntervalScheduler();
  const mockJob = jest.fn(() => {
    console.log('Execued at', new Date());
    console.log('job 1');
  });
  // Add new minutes to current time
  const startAt = new Date(+new Date() + 60000 * 2);
  console.log('Start At', startAt);
  scheduler.addJob(mockJob, startAt);
  scheduler.start();
  jest.advanceTimersByTime(1000 * 122);
  expect(mockJob).toBeCalledTimes(1);
  scheduler.stop();
});

test('pass args to job', () => {
  const scheduler = new SetIntervalScheduler();
  const mockJob = jest.fn(
    (jobId: number, args: {arg1: string; arg2: number}) => {
      console.log('Execued at', new Date());
      console.log('job 1', jobId, args.arg1, args.arg2);
    }
  );
  const startAt = new Date(+new Date() + 60000 * 2);
  console.log('Start At', startAt);
  const jobId = scheduler.addJob(mockJob, startAt, {arg1: 'arg1', arg2: 2});
  scheduler.start();
  jest.advanceTimersByTime(1000 * 122);
  expect(mockJob).toBeCalledTimes(1);
  expect(mockJob).toBeCalledWith(jobId, {arg1: 'arg1', arg2: 2});
  scheduler.stop();
});
