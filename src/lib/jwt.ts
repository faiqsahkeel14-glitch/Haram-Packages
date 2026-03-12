import jwt, { SignOptions } from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  username: string;
  iat?: number;
  exp?: number;
}

const JWT_SECRET: string = process.env.JWT_SECRET || 'fallback-secret-key-change-in-production';
const JWT_EXPIRES: string = process.env.JWT_EXPIRES_IN || '7d';

export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  const options: SignOptions = {
    expiresIn: JWT_EXPIRES,
  };
  return jwt.sign(payload, JWT_SECRET, options);
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

export function decodeToken(token: string): JWTPayload | null {
  try {
    const decoded = jwt.decode(token) as JWTPayload;
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

// Backward compatibility
export async function generateToken(userId: number, username: string): Promise<string> {
  return signToken({ userId, username });
}
