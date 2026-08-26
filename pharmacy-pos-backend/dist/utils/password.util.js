import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
/**
 * Securely hashes a plain-text password using bcrypt.
 */
export async function hashPassword(password) {
    return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}
/**
 * Securely compares a plain-text password with a bcrypt hash.
 */
export async function comparePassword(password, passwordHash) {
    return bcrypt.compare(password, passwordHash);
}
//# sourceMappingURL=password.util.js.map