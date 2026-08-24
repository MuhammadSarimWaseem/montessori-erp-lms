import { NextResponse } from 'next/server';
import { generateDynamicInsights } from '@/lib/ai/aiEngine';

export async function GET() {
  const insights = generateDynamicInsights();
  return NextResponse.json({ success: true, count: insights.length, data: insights });
}
