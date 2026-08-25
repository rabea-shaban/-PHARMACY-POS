import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}
