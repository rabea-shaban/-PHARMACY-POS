import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
/**
 * Generates a signed JWT access token containing staff identity.
 */
export function generateAccessToken(user) {
    const payload = {
        userId: user.id,
        role: user.role,
    };
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    });
}
/**
 * Verifies a JWT access token and extracts the typed payload.
 */
export function verifyAccessToken(token) {
    return jwt.verify(token, env.JWT_SECRET);
}
//# sourceMappingURL=jwt.util.js.map