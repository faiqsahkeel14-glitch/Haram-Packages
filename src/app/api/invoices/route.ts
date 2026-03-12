import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';
import { Prisma } from '@prisma/client';

// Middleware to check authentication
function authenticateRequest(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null;
}

// GET /api/invoices - Fetch all invoices
export async function GET(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const invoices = await prisma.invoice.findMany({
      include: {
        customer: { select: { name: true, type: true } },
      },
      orderBy: { invoice_date: 'desc' },
    });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error('GET /api/invoices error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

// POST /api/invoices - Create a new invoice
export async function POST(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { customerId, description, quantity, unit_price, total, invoice_date } = body;

    if (!customerId || !quantity || !unit_price || !total || !invoice_date) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Get customer
      const customer = await tx.customer.findUnique({
        where: { id: parseInt(customerId) },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Get ledger
      const ledger = await tx.customerLedger.findUnique({
        where: { customerId: parseInt(customerId) },
      });

      if (!ledger) {
        throw new Error('Customer ledger not found');
      }

      // Create invoice
      const invoice = await tx.invoice.create({
        data: {
          customerId: parseInt(customerId),
          description: description || null,
          quantity: parseInt(quantity),
          unit_price: new Prisma.Decimal(unit_price),
          total: new Prisma.Decimal(total),
          invoice_date: new Date(invoice_date),
        },
        include: {
          customer: { select: { name: true, type: true } },
        },
      });

      // Update ledger balance
      const totalAmount = new Prisma.Decimal(total);
      let newLedgerBalance: Prisma.Decimal;

      if (customer.type === 'customer') {
        // Sale invoice - customer owes us
        newLedgerBalance = ledger.balance.plus(totalAmount);
      } else {
        // Purchase invoice - we owe seller
        newLedgerBalance = ledger.balance.minus(totalAmount);
      }

      await tx.customerLedger.update({
        where: { customerId: parseInt(customerId) },
        data: { balance: newLedgerBalance },
      });

      return invoice;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/invoices error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create invoice' },
      { status: 500 }
    );
  }
}
