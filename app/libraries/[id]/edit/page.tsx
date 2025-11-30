'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Library } from '@/types';
import AddLibraryForm from '@/components/AddLibraryForm';
import { Loader2 } from 'lucide-react';

export default function EditLibraryPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [library, setLibrary] = useState<Library | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchLibrary() {
            try {
                const { id } = await params;
                const res = await fetch(`/api/libraries/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setLibrary(data);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('Failed to fetch library', error);
            } finally {
                setLoading(false);
            }
        }
        fetchLibrary();
    }, [params, router]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={48} />
            </div>
        );
    }

    if (!library) return null;

    return (
        <AddLibraryForm
            onClose={() => router.push(`/libraries/${library.id}`)}
            userLocation={null}
            initialData={library}
        />
    );
}
