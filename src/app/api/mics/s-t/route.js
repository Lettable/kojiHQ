import { NextResponse } from 'next/server';

export function GET() {
  const serverTime = new Date().toISOString();
  return NextResponse.json({ serverTime });
}
