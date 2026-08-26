import { prisma } from '../lib/prisma.js';
function stringifySafe(val) {
    if (!val)
        return null;
    if (typeof val === 'string')
        return val;
    try {
        return JSON.stringify(val);
    }
    catch {
        return null;
    }
}
export class AuditRepository {
    async log(data) {
        try {
            return await prisma.auditLog.create({
                data: {
                    userId: data.userId || null,
                    action: data.action,
                    entity: data.entity,
                    entityId: data.entityId || null,
                    oldData: stringifySafe(data.oldData),
                    newData: stringifySafe(data.newData),
                    metadata: stringifySafe(data.metadata),
                },
            });
        }
        catch (error) {
            // Audit log creation should not break primary operations if non-fatal
            console.warn('⚠️ Audit log creation error:', error.message);
            return null;
        }
    }
}
export const auditRepository = new AuditRepository();
//# sourceMappingURL=audit.repository.js.map