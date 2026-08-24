import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db/supabaseClient';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const sqlPath = path.join(process.cwd(), 'supabase-schema.sql');
    let sqlContent = '';
    if (fs.existsSync(sqlPath)) {
      sqlContent = fs.readFileSync(sqlPath, 'utf8');
    }

    return NextResponse.json({
      status: 'Ready',
      message: 'Copy and execute the sqlScript content into Supabase SQL Editor: https://supabase.com/dashboard/project/gkuzymsprlnetkhhaqow/sql/new',
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
      projectId: process.env.SUPABASE_PROJECT_ID,
      sqlScript: sqlContent
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const sqlPath = path.join(process.cwd(), 'supabase-schema.sql');
    let sqlContent = '';
    if (fs.existsSync(sqlPath)) {
      sqlContent = fs.readFileSync(sqlPath, 'utf8');
    }

    return NextResponse.json({
      success: true,
      instructions: 'Please paste sqlScript into Supabase SQL Editor to generate all 10 relational tables & seed data.',
      sqlScript: sqlContent
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
