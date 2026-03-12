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

// PUT /api/customers/:id - Update a customer
export async function PUT(
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
    const body = await req.json();

    const customer = await prisma.customer.update({
      where: { id: parseInt(id) },
      data: body,
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
      { status: 200 }
    );
  } catch (error: any) {
    console.error('PUT /api/customers/:id error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to update customer' },
      { status: 500 }
    );
  }
}

// DELETE /api/customers/:id - Delete a customer
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

    await prisma.customer.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json(
      { success: true, message: 'Customer deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('DELETE /api/customers/:id error:', error);
    if (error.code === 'P2025') {
      return NextResponse.json(
        { success: false, message: 'Customer not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to delete customer' },
      { status: 500 }
    );
  }
}
