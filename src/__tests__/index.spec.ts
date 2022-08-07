import {expect, test, jest} from '@jest/globals';
import {Scheduler} from '../index';
jest.useFakeTimers();

test('add new job Scheduler', () => {
  const scheduler = new Scheduler();
  const mockJob = jest.fn(() => {
    console.log('Execued at', new Date());
    console.log('job 1');
  });
  const startAt = new Date(+new Date() + 60000 * 2);
  console.log('Start At', startAt);
  scheduler.addJob(mockJob, startAt);
  scheduler.start();
  jest.advanceTimersByTime(1000 * 122);
  expect(mockJob).toBeCalledTimes(1);
  scheduler.stop();
});
