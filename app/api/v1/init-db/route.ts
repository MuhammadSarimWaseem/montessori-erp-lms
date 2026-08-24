import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabaseClient';
import { INITIAL_STUDENTS, MONTESSORI_MATERIALS, INITIAL_OBSERVATIONS, INITIAL_ATTENDANCE, INITIAL_INVOICES } from '@/lib/db/data';

export async function POST() {
  try {
    // Attempt seeding sample data to Supabase if tables exist
    const { error: stdErr } = await supabase.from('students').upsert(INITIAL_STUDENTS);
    const { error: obsErr } = await supabase.from('observations').upsert(INITIAL_OBSERVATIONS);
    const { error: attErr } = await supabase.from('attendance').upsert(INITIAL_ATTENDANCE);
    const { error: invErr } = await supabase.from('invoices').upsert(INITIAL_INVOICES);

    return NextResponse.json({
      success: true,
      message: 'Database schema & seed initialization executed successfully.',
      details: {
        studentsError: stdErr ? stdErr.message : null,
        observationsError: obsErr ? obsErr.message : null,
        attendanceError: attErr ? attErr.message : null,
        invoicesError: invErr ? invErr.message : null,
      }
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Ready',
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    projectId: process.env.SUPABASE_PROJECT_ID
  });
}
