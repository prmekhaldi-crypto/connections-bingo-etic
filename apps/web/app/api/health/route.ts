import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export type HealthStatus = {
  status: 'ok';
  service: string;
  timestamp: string;
};

export function GET() {
  const body: HealthStatus = {
    status: 'ok',
    service: 'game-platform-web',
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(body);
}
