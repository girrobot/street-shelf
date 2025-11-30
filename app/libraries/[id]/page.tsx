import { Library } from '@/types';
import { headers } from 'next/headers';
import Link from 'next/link';
import { ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { notFound } from 'next/navigation';
import LibraryActions from '@/components/LibraryActions';

async function getLibrary(id: string): Promise<Library | null> {
    try {
        const host = (await headers()).get('host');
        const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
        const res = await fetch(`${protocol}://${host}/api/libraries`, { cache: 'no-store' });
        if (!res.ok) return null;
        const libraries: Library[] = await res.json();
        return libraries.find((lib) => lib.id === id) || null;
    } catch (error) {
        console.error('Failed to fetch library:', error);
        return null;
    }
}

export default async function LibraryDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const library = await getLibrary(id);

    if (!library) {
        notFound();
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${library.latitude},${library.longitude}`;

    return (
        <main className="min-h-screen bg-gray-50 pb-8">
            <div className="bg-white sticky top-0 z-10 border-b px-4 py-3 flex items-center gap-4">
                <Link href="/" className="p-2 hover:bg-gray-100 rounded-full">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-bold text-lg truncate">{library.name}</h1>
            </div>

            <div className="max-w-2xl mx-auto">
                {library.photoUrl ? (
                    <img
                        src={library.photoUrl}
                        alt={library.name}
                        className="w-full h-64 sm:h-80 object-cover"
                    />
                ) : (
                    <div className="w-full h-64 sm:h-80 bg-gray-200 flex items-center justify-center text-gray-400">
                        <MapPin size={48} />
                    </div>
                )}

                <div className="p-6 space-y-6">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{library.name}</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{library.description}</p>
                    </div>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                    >
                        <Navigation size={20} />
                        Get Directions
                    </a>

                    <LibraryActions id={library.id} />

                    <div className="text-sm text-gray-500 pt-4 border-t">
                        Added on {new Date(library.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </div>
        </main>
    );
}
