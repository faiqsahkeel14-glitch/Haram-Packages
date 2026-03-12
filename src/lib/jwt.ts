import jwt from 'jsonwebtoken';
import { jwtVerify } from 'jose';

const secret = process.env.JWT_SECRET || 'your_secret_key_here_min_32_chars';

export async function generateToken(userId: number, username: string): Promise<string> {
  const token = jwt.sign({ userId, username }, secret, { expiresIn: '7d' });
  return token;
}

export async function verifyToken(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const decoded = jwt.verify(token, secret) as { userId: number; username: string };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function getTokenFromRequest(req: Request): string | null {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1];
}
