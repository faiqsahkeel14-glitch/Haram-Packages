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

// GET /api/stats/summary - Get dashboard statistics
export async function GET(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Define date range for current month
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // 1. Calculate this month's receivables (sale invoices)
    const monthlyReceivables = await prisma.invoice.aggregate({
      where: {
        invoice_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        customer: { type: 'customer' },
      },
      _sum: { total: true },
    });

    // 2. Calculate this month's payables (purchase invoices)
    const monthlyPayables = await prisma.invoice.aggregate({
      where: {
        invoice_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
        customer: { type: 'seller' },
      },
      _sum: { total: true },
    });

    // 3. Calculate monthly income
    const monthlyIncome = await prisma.transaction.aggregate({
      where: {
        direction: 'inward',
        transaction_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
      _sum: { amount: true },
    });

    // 4. Calculate monthly expense
    const monthlyExpense = await prisma.transaction.aggregate({
      where: {
        direction: 'outward',
        transaction_date: { gte: firstDayOfMonth, lte: lastDayOfMonth },
      },
      _sum: { amount: true },
    });

    // 5. Get top 5 debtors
    const topDebtors = await prisma.customer.findMany({
      where: { type: 'customer' },
      include: {
        invoices: {
          where: { invoice_date: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
        },
        ledger: true,
      },
      orderBy: { ledger: { balance: 'desc' } },
      take: 5,
    });

    // 6. Get top 5 creditors
    const topCreditors = await prisma.customer.findMany({
      where: { type: 'seller' },
      include: {
        invoices: {
          where: { invoice_date: { gte: firstDayOfMonth, lte: lastDayOfMonth } },
        },
        ledger: true,
      },
      orderBy: { ledger: { balance: 'asc' } },
      take: 5,
    });

    // Format response
    const summary = {
      totalReceivables: monthlyReceivables._sum.total?.toNumber() || 0,
      totalPayables: monthlyPayables._sum.total?.toNumber() || 0,
      monthlyIncome: monthlyIncome._sum.amount?.toNumber() || 0,
      monthlyExpense: monthlyExpense._sum.amount?.toNumber() || 0,
      netMonthlyFlow: (monthlyIncome._sum.amount?.toNumber() || 0) - (monthlyExpense._sum.amount?.toNumber() || 0),
      topDebtors: topDebtors.map((c) => ({
        name: c.name,
        CustomerLedger: { balance: c.ledger?.balance.toNumber() || 0 },
      })),
      topCreditors: topCreditors.map((c) => ({
        name: c.name,
        CustomerLedger: { balance: c.ledger?.balance.toNumber() || 0 },
      })),
    };

    return NextResponse.json(summary, { status: 200 });
  } catch (error) {
    console.error('GET /api/stats/summary error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}
