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

        let count = 0;
        for (const lib of libraries) {
            await prisma.library.create({
                data: {
                    name: lib.name,
                    description: lib.description,
                    latitude: lib.latitude,
                    longitude: lib.longitude,
                    photoUrl: lib.photoUrl,
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
