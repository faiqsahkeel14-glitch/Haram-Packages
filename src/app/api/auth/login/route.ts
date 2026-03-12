import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Get credentials from environment variables
    const validUsername = process.env.LOGIN_USERNAME || 'admin';
    const validPassword = process.env.LOGIN_PASSWORD || 'admin123';

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Check credentials
    if (username !== validUsername || password !== validPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = await generateToken(1, username);

    return NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        token,
        user: {
          id: 1,
          username,
          email: `${username}@haram-packages.com`,
          firstName: 'Admin',
          lastName: 'User',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
