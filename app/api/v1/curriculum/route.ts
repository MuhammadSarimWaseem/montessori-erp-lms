import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');
  const materials = db.getMaterials();
  let masteryRecords: any[] = [];
  if (studentId) {
    masteryRecords = db.getMasteryRecords(studentId);
  }
  return NextResponse.json({ success: true, materials, masteryRecords });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, materialId, status, notes } = body;
    const record = db.updateMasteryStatus(studentId, materialId, status, notes);
    return NextResponse.json({ success: true, data: record });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
