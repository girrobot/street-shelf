import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
    const dataFilePath = path.join(process.cwd(), 'data', 'libraries.json');

    if (!fs.existsSync(dataFilePath)) {
        console.log('No libraries.json found, skipping seed.');
        return;
    }

    const fileContent = fs.readFileSync(dataFilePath, 'utf8');
    const libraries = JSON.parse(fileContent);

    console.log(`Found ${libraries.length} libraries to seed.`);

    // Create a seed user if not exists
    const SEED_USER_ID = '00000000-0000-0000-0000-000000000000'; // System User ID

    await prisma.user.upsert({
        where: { id: SEED_USER_ID },
        update: {},
        create: {
            id: SEED_USER_ID,
            email: 'system@streetshelf.app',
        },
    });

    for (const lib of libraries) {
        await prisma.library.create({
            data: {
                name: lib.name,
                description: lib.description,
                latitude: lib.latitude,
                longitude: lib.longitude,
                photoUrl: lib.photoUrl,
                userId: SEED_USER_ID,
                // We let Prisma handle ID and createdAt if we want, or we can preserve them.
                // Since we are migrating, let's try to preserve if possible, but schema has default uuid.
                // Let's just map fields and let ID be new to avoid UUID vs string issues if JSON had simple IDs.
                // Actually, JSON had "1" as ID. UUID is expected. Let's let Prisma generate new IDs.
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
