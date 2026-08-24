import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;
  const observations = db.getObservations(tenantId, studentId);
  return NextResponse.json({ success: true, count: observations.length, data: observations });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newNote = db.addObservation(body);
    return NextResponse.json({ success: true, data: newNote });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
