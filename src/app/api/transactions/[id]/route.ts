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

// DELETE /api/transactions/:id - Delete a transaction and reverse balances
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

    // Use transaction to atomically reverse the balances
    await prisma.$transaction(async (tx) => {
      // Find the transaction
      const transaction = await tx.transaction.findUnique({
        where: { id: parseInt(id) },
      });

      if (!transaction) {
        throw new Error('Transaction not found');
      }

      // Reverse account balance
      const account = await tx.account.findUnique({
        where: { id: transaction.accountId },
      });

      if (account) {
        const amountValue = new Prisma.Decimal(transaction.amount.toString());
        const reverseBalance =
          transaction.direction === 'inward'
            ? account.balance.minus(amountValue)
            : account.balance.plus(amountValue);

        await tx.account.update({
          where: { id: transaction.accountId },
          data: { balance: reverseBalance },
        });
      }

      // Reverse ledger balance
      const ledger = await tx.customerLedger.findUnique({
        where: { customerId: transaction.customerId },
      });

      if (ledger) {
        const amountValue = new Prisma.Decimal(transaction.amount.toString());
        const reverseLedgerBalance =
          transaction.direction === 'inward'
            ? ledger.balance.plus(amountValue)
            : ledger.balance.minus(amountValue);

        await tx.customerLedger.update({
          where: { customerId: transaction.customerId },
          data: { balance: reverseLedgerBalance },
        });
      }

      // Delete the transaction
      await tx.transaction.delete({
        where: { id: parseInt(id) },
      });
    });

    return NextResponse.json(
      { success: true, message: 'Transaction deleted and balances reversed' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/transactions/:id error:', error);
    if (error.message === 'Transaction not found') {
      return NextResponse.json(
        { success: false, message: 'Transaction not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to delete transaction' },
      { status: 500 }
    );
  }
}
