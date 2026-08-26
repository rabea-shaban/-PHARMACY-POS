import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';
/**
 * Securely hashes a plain-text password using bcrypt.
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}
/**
 * Securely compares a plain-text password against a bcrypt hash.
 */
export async function comparePassword(password, hash) {
    return bcrypt.compare(password, hash);
}
/**
 * Signs a JWT access token containing staff identity.
 */
export function signAccessToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}
/**
 * Verifies a JWT access token and returns the typed payload.
 */
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=auth.utils.js.map