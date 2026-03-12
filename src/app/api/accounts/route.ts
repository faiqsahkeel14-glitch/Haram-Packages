import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';

// Middleware to check authentication
function authenticateRequest(req: NextRequest): boolean {
  const token = getTokenFromRequest(req);
  if (!token) return false;
  const decoded = verifyToken(token);
  return decoded !== null;
}

// GET /api/accounts - Fetch all accounts
export async function GET(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const accounts = await prisma.account.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(accounts, { status: 200 });
  } catch (error) {
    console.error('GET /api/accounts error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}

// POST /api/accounts - Create a new account
export async function POST(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, balance } = body;

    if (!name) {
      return NextResponse.json(
        { success: false, message: 'Account name is required' },
        { status: 400 }
      );
    }

    const account = await prisma.account.create({
      data: {
        name,
        balance: balance || 0,
      },
    });

    return NextResponse.json(account, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/accounts error:', error);
    if (error.code === 'P2002') {
      return NextResponse.json(
        { success: false, message: 'Account name already exists' },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to create account' },
      { status: 500 }
    );
  }
}
