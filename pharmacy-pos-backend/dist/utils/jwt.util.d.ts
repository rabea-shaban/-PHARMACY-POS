import { Role } from '@prisma/client';
export interface TokenPayload {
    userId: string;
    role: Role;
}
/**
 * Generates a signed JWT access token containing staff identity.
 */
export declare function generateAccessToken(user: {
    id: string;
    role: Role;
}): string;
/**
 * Verifies a JWT access token and extracts the typed payload.
 */
export declare function verifyAccessToken(token: string): TokenPayload;
