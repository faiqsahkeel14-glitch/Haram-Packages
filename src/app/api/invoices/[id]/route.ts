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

// DELETE /api/invoices/:id - Delete an invoice and reverse ledger
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = context.params;

    // Use transaction to atomically reverse the ledger
    await prisma.$transaction(async (tx) => {
      // Find the invoice
      const invoice = await tx.invoice.findUnique({
        where: { id: parseInt(id) },
      });

      if (!invoice) {
        throw new Error('Invoice not found');
      }

      // Get customer to check type
      const customer = await tx.customer.findUnique({
        where: { id: invoice.customerId },
      });

      if (!customer) {
        throw new Error('Customer not found');
      }

      // Get ledger
      const ledger = await tx.customerLedger.findUnique({
        where: { customerId: invoice.customerId },
      });

      if (ledger) {
        const invoiceTotal = new Prisma.Decimal(invoice.total.toString());
        let reverseLedgerBalance: Prisma.Decimal;

        if (customer.type === 'customer') {
          // Reverse sale invoice
          reverseLedgerBalance = ledger.balance.minus(invoiceTotal);
        } else {
          // Reverse purchase invoice
          reverseLedgerBalance = ledger.balance.plus(invoiceTotal);
        }

        await tx.customerLedger.update({
          where: { customerId: invoice.customerId },
          data: { balance: reverseLedgerBalance },
        });
      }

      // Delete the invoice
      await tx.invoice.delete({
        where: { id: parseInt(id) },
      });
    });

    return NextResponse.json(
      { success: true, message: 'Invoice deleted and ledger updated' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/invoices/:id error:', error);
    if (error.message === 'Invoice not found') {
      return NextResponse.json(
        { success: false, message: 'Invoice not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to delete invoice' },
      { status: 500 }
    );
  }
}
