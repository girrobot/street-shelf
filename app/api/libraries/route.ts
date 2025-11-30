import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const libraries = await prisma.library.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(libraries);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch libraries' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, latitude, longitude, photoUrl } = body;

    if (!name || !latitude || !longitude) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newLibrary = await prisma.library.create({
      data: {
        name,
        description: description || '',
        latitude,
        longitude,
        photoUrl: photoUrl || '',
      },
    });

    return NextResponse.json(newLibrary, { status: 201 });
  } catch (error) {
    console.error('Error creating library:', error);
    return NextResponse.json({ error: 'Failed to save library' }, { status: 500 });
  }
}
