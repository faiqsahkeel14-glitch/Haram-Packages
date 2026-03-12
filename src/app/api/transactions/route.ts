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

// GET /api/transactions - Fetch all transactions
export async function GET(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const transactions = await prisma.transaction.findMany({
      include: {
        customer: { select: { name: true } },
        account: { select: { name: true } },
      },
      orderBy: [{ transaction_date: 'desc' }, { createdAt: 'desc' }],
    });

    return NextResponse.json(transactions, { status: 200 });
  } catch (error) {
    console.error('GET /api/transactions error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}

// POST /api/transactions - Create a new transaction
export async function POST(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { customerId, accountId, direction, amount, description, transaction_date } = body;

    if (!customerId || !accountId || !direction || !amount || !transaction_date) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use Prisma transaction for atomic operations
    const result = await prisma.$transaction(async (tx) => {
      // Get account and lock it
      const account = await tx.account.findUnique({
        where: { id: parseInt(accountId) },
      });

      if (!account) {
        throw new Error('Account not found');
      }

      // Update account balance
      const amountValue = new Prisma.Decimal(amount);
      const newBalance =
        direction === 'inward'
          ? account.balance.plus(amountValue)
          : account.balance.minus(amountValue);

      await tx.account.update({
        where: { id: parseInt(accountId) },
        data: { balance: newBalance },
      });

      // Get customer ledger
      const ledger = await tx.customerLedger.findUnique({
        where: { customerId: parseInt(customerId) },
      });

      if (!ledger) {
        throw new Error('Customer ledger not found');
      }

      // Update ledger balance (opposite direction)
      const newLedgerBalance =
        direction === 'inward'
          ? ledger.balance.minus(amountValue)
          : ledger.balance.plus(amountValue);

      await tx.customerLedger.update({
        where: { customerId: parseInt(customerId) },
        data: { balance: newLedgerBalance },
      });

      // Create transaction
      const transaction = await tx.transaction.create({
        data: {
          customerId: parseInt(customerId),
          accountId: parseInt(accountId),
          direction,
          amount: amountValue,
          description: description || null,
          transaction_date: new Date(transaction_date),
        },
        include: {
          customer: { select: { name: true } },
          account: { select: { name: true } },
        },
      });

      return transaction;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/transactions error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to create transaction' },
      { status: 500 }
    );
  }
}
