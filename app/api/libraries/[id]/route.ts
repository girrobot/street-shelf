import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const library = await prisma.library.findUnique({
            where: { id },
            include: { user: { select: { email: true } } }
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
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check ownership
        const existingLibrary = await prisma.library.findUnique({ where: { id } });
        if (!existingLibrary) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existingLibrary.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

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
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Check ownership
        const existingLibrary = await prisma.library.findUnique({ where: { id } });
        if (!existingLibrary) return NextResponse.json({ error: 'Not found' }, { status: 404 });
        if (existingLibrary.userId !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.library.delete({
            where: { id },
        });

        return NextResponse.json({ message: 'Library deleted' });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete library' }, { status: 500 });
    }
}
