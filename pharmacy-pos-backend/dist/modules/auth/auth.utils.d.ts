import { JwtPayload } from './auth.types.js';
/**
 * Securely hashes a plain-text password using bcrypt.
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Securely compares a plain-text password against a bcrypt hash.
 */
export declare function comparePassword(password: string, hash: string): Promise<boolean>;
/**
 * Signs a JWT access token containing staff identity.
 */
export declare function signAccessToken(payload: JwtPayload): string;
/**
 * Verifies a JWT access token and returns the typed payload.
 */
export declare function verifyAccessToken(token: string): JwtPayload;
