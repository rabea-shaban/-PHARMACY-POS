import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { env } from '../config/env.js';

export interface TokenPayload {
  userId: string;
  role: Role;
}

/**
 * Generates a signed JWT access token containing staff identity.
 */
export function generateAccessToken(user: { id: string; role: Role }): string {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verifies a JWT access token and extracts the typed payload.
 */
export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayload;
}
