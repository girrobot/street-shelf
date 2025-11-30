import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const library = await prisma.library.findUnique({
            where: { id },
        });

        if (!library) {
            return NextResponse.json({ error: 'Library not found' }, { status: 404 });
        }

        return NextResponse.json(library);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch library' }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { name, description, latitude, longitude, photoUrl } = body;

        const updatedLibrary = await prisma.library.update({
            where: { id },
            data: {
                name,
                description,
                latitude,
                longitude,
                photoUrl,
            },
        });

        return NextResponse.json(updatedLibrary);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update library' }, { status: 500 });
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        await prisma.library.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Library deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete library' }, { status: 500 });
    }
}
