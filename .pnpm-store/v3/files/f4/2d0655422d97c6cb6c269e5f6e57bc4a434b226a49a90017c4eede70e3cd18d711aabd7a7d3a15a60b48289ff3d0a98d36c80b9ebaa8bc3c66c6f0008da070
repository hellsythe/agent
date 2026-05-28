import {
  startMongoTestInfrastructure,
  stopTestInfrastructure,
} from './test-infrastructure';

beforeAll(async () => {
  await startMongoTestInfrastructure();
}, 180000);

afterAll(async () => {
  await stopTestInfrastructure();
}, 180000);
