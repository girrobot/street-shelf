'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Library } from '@/types';
import LibraryList from './LibraryList';
import AddLibraryForm from './AddLibraryForm';
import AuthButton from './AuthButton';
import { Plus } from 'lucide-react';

// Dynamic import for Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('./Map'), { ssr: false });

interface HomeClientProps {
    initialLibraries: Library[];
}

export default function HomeClient({ initialLibraries }: HomeClientProps) {
    const [libraries, setLibraries] = useState<Library[]>(initialLibraries);
    const [showAddForm, setShowAddForm] = useState(false);
    const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

    useEffect(() => {
        // Get user location on load
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation([position.coords.latitude, position.coords.longitude]);
                },
                (error) => {
                    console.log('Error getting location:', error);
                }
            );
        }
    }, []);

    return (
        <main className="h-screen flex flex-col relative bg-gray-50">
            <div className="absolute top-4 right-4 z-20">
                <AuthButton />
            </div>
            <div className="flex-1 relative z-0">
                <Map libraries={libraries} userLocation={userLocation} />
            </div>

            <LibraryList libraries={libraries} />

            <button
                onClick={() => setShowAddForm(true)}
                className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl z-20 hover:bg-blue-700 transition-transform hover:scale-105 active:scale-95"
            >
                <Plus size={32} />
            </button>

            {showAddForm && (
                <AddLibraryForm
                    onClose={() => setShowAddForm(false)}
                    userLocation={userLocation}
                />
            )}
        </main>
    );
}
