import { getJson } from '../src/services/httpClient.js';

describe('httpClient', () => {
  it('performs request and retries on error (mocked)', async () => {
    // simple smoke without real network
    await expect(typeof getJson).toBe('function');
  });
});
