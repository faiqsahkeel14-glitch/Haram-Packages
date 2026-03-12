import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    // Mock data - replace with database query
    const mockPackage = {
      id,
      name: `Package ${id}`,
      description: `Description for package ${id}`,
      price: 29.99 * id,
      quantity: 100 - id * 10,
      createdAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        data: mockPackage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get package error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { name, description, price, quantity } = body;

    if (!name || !price) {
      return NextResponse.json(
        { success: false, message: 'Name and price are required' },
        { status: 400 }
      );
    }

    const id = parseInt(params.id);
    const updatedPackage = {
      id,
      name,
      description,
      price,
      quantity: quantity || 0,
      createdAt: new Date(),
    };

    return NextResponse.json(
      {
        success: true,
        message: 'Package updated successfully',
        data: updatedPackage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Update package error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = getTokenFromRequest(req);

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const decoded = await verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const id = parseInt(params.id);

    return NextResponse.json(
      {
        success: true,
        message: `Package ${id} deleted successfully`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Delete package error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
