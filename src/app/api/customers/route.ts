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

// GET /api/customers - Fetch all customers
export async function GET(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const customers = await prisma.customer.findMany({
      include: {
        ledger: {
          select: { balance: true },
        },
      },
      orderBy: { name: 'asc' },
    });

    // Format the response to match frontend expectations
    const formattedCustomers = customers.map((customer) => ({
      ...customer,
      CustomerLedger: customer.ledger,
      ledger: undefined, // Remove ledger, use CustomerLedger instead
    }));

    return NextResponse.json(formattedCustomers, { status: 200 });
  } catch (error) {
    console.error('GET /api/customers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}

// POST /api/customers - Create a new customer
export async function POST(req: NextRequest) {
  try {
    if (!authenticateRequest(req)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, type, address, phone, opening_balance } = body;

    if (!name || !type) {
      return NextResponse.json(
        { success: false, message: 'Name and type are required' },
        { status: 400 }
      );
    }

    // Create customer and ledger in a transaction
    const customer = await prisma.customer.create({
      data: {
        name,
        type,
        address: address || null,
        phone: phone || null,
        opening_balance: opening_balance || 0,
        ledger: {
          create: {
            balance: opening_balance || 0,
          },
        },
      },
      include: {
        ledger: true,
      },
    });

    return NextResponse.json(
      {
        ...customer,
        CustomerLedger: customer.ledger,
        ledger: undefined,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('POST /api/customers error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create customer' },
      { status: 500 }
    );
  }
}
