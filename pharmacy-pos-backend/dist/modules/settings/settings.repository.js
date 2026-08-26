import { prisma } from '../../lib/prisma.js';
export class SettingsRepository {
    async findAll() {
        return prisma.systemSetting.findMany({
            orderBy: { key: 'asc' },
        });
    }
    async findPublic() {
        return prisma.systemSetting.findMany({
            where: { isPublic: true },
            orderBy: { key: 'asc' },
        });
    }
    async findByKey(key) {
        return prisma.systemSetting.findUnique({
            where: { key },
        });
    }
    async upsertSetting(data) {
        return prisma.systemSetting.upsert({
            where: { key: data.key },
            create: {
                key: data.key,
                value: data.value,
                description: data.description || null,
                isPublic: data.isPublic ?? false,
            },
            update: {
                value: data.value,
                ...(data.description !== undefined ? { description: data.description } : {}),
                ...(data.isPublic !== undefined ? { isPublic: data.isPublic } : {}),
            },
        });
    }
    async upsertMany(settings) {
        return prisma.$transaction(async (tx) => {
            const results = [];
            for (const s of settings) {
                const item = await tx.systemSetting.upsert({
                    where: { key: s.key },
                    create: {
                        key: s.key,
                        value: s.value,
                        description: s.description || null,
                        isPublic: s.isPublic ?? false,
                    },
                    update: {
                        value: s.value,
                        ...(s.description !== undefined ? { description: s.description } : {}),
                        ...(s.isPublic !== undefined ? { isPublic: s.isPublic } : {}),
                    },
                });
                results.push(item);
            }
            return results;
        });
    }
}
export const settingsRepository = new SettingsRepository();
//# sourceMappingURL=settings.repository.js.map