import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date') || undefined;
  const tenantId = searchParams.get('tenantId') || undefined;
  const attendance = db.getAttendance(date, tenantId);
  return NextResponse.json({ success: true, count: attendance.length, data: attendance });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, status, tenantId } = body;
    const record = db.markAttendance(studentId, status, tenantId);
    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
