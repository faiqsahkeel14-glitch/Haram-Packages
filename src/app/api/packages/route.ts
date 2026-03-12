import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/jwt';

// Mock data - replace with database queries
const packages = [
  {
    id: 1,
    name: 'Starter Package',
    description: 'Basic package for beginners',
    price: 29.99,
    quantity: 100,
    createdAt: new Date(),
  },
  {
    id: 2,
    name: 'Professional Package',
    description: 'For professionals and teams',
    price: 79.99,
    quantity: 50,
    createdAt: new Date(),
  },
  {
    id: 3,
    name: 'Enterprise Package',
    description: 'Full-featured enterprise solution',
    price: 199.99,
    quantity: 20,
    createdAt: new Date(),
  },
];

export async function GET(req: NextRequest) {
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

    return NextResponse.json(
      {
        success: true,
        data: packages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get packages error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
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

    const newPackage = {
      id: packages.length + 1,
      name,
      description,
      price,
      quantity: quantity || 0,
      createdAt: new Date(),
    };

    packages.push(newPackage);

    return NextResponse.json(
      {
        success: true,
        message: 'Package created successfully',
        data: newPackage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create package error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
