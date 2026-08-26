/**
 * Securely hashes a plain-text password using bcrypt.
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Securely compares a plain-text password with a bcrypt hash.
 */
export declare function comparePassword(password: string, passwordHash: string): Promise<boolean>;
