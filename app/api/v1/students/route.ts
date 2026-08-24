import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId') || undefined;
  const students = db.getStudents(tenantId);
  return NextResponse.json({ success: true, count: students.length, data: students });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, pointsDelta } = body;
    if (studentId && pointsDelta) {
      const updated = db.updateStudentStarPoints(studentId, pointsDelta);
      return NextResponse.json({ success: true, data: updated });
    }
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
