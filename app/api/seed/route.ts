import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export async function GET() {
    try {
        const dataFilePath = path.join(process.cwd(), 'data', 'libraries.json');
        if (!fs.existsSync(dataFilePath)) {
            return NextResponse.json({ message: 'No data file found' });
        }

        const fileContent = fs.readFileSync(dataFilePath, 'utf8');
        const libraries = JSON.parse(fileContent);

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

        let count = 0;
        for (const lib of libraries) {
            await prisma.library.create({
                data: {
                    name: lib.name,
                    description: lib.description,
                    latitude: lib.latitude,
                    longitude: lib.longitude,
                    photoUrl: lib.photoUrl,
                    userId: SEED_USER_ID,
                },
            });
            count++;
        }

        return NextResponse.json({ message: `Seeded ${count} libraries` });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
    }
}
