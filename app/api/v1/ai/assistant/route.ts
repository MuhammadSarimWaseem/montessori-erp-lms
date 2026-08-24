import { NextResponse } from 'next/server';
import { processAiAssistantMessage } from '@/lib/ai/aiEngine';
import { UserRole } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text, role, tenantId } = body;
    const response = processAiAssistantMessage(text || '', (role as UserRole) || 'TEACHER', tenantId);
    return NextResponse.json({ success: true, data: response });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
