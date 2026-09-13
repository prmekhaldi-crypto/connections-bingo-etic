import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('GET /api/health', () => {
  it('returns an ok status', async () => {
    const response = GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toMatchObject({ status: 'ok', service: 'game-platform-web' });
    expect(typeof body.timestamp).toBe('string');
  });
});
