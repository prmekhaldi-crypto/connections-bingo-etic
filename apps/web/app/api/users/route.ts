import { NextResponse, type NextRequest } from 'next/server';
import { getDb } from '@/db/client';
import { users } from '@/db/schema';

export const dynamic = 'force-dynamic';

const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;

function isValidUsername(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= USERNAME_MIN_LENGTH &&
    value.length <= USERNAME_MAX_LENGTH
  );
}

function isUniqueViolation(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === '23505'
  );
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const username = (body as { username?: unknown } | null)?.username;
  if (!isValidUsername(username)) {
    return NextResponse.json(
      { message: `username must be ${USERNAME_MIN_LENGTH}-${USERNAME_MAX_LENGTH} characters` },
      { status: 400 },
    );
  }

  try {
    const [user] = await getDb().insert(users).values({ username }).returning();
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return NextResponse.json({ message: 'username already exists' }, { status: 409 });
    }
    throw error;
  }
}
