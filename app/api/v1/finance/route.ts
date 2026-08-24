import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const tenantId = searchParams.get('tenantId') || undefined;
  const studentId = searchParams.get('studentId') || undefined;
  const invoices = db.getInvoices(tenantId, studentId);
  const payroll = db.getPayroll(tenantId);
  return NextResponse.json({ 
    success: true, 
    data: { 
      invoices, 
      payroll,
      totalCollected: invoices.filter(i => i.status === 'PAID').reduce((sum, i) => sum + i.amount, 0),
      totalPending: invoices.filter(i => i.status !== 'PAID').reduce((sum, i) => sum + i.amount, 0)
    } 
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { invoiceId } = body;
    if (invoiceId) {
      const paid = db.payInvoice(invoiceId);
      return NextResponse.json({ success: true, data: paid });
    }
    return NextResponse.json({ success: false, error: 'Invoice ID required' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
