'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Loader2, Upload, X } from 'lucide-react';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import { Library } from '@/types';
import { createClient } from '@/utils/supabase/client';

const LocationPicker = dynamic(() => import('./LocationPicker'), {
    ssr: false,
    loading: () => <div className="h-[200px] w-full bg-gray-100 animate-pulse rounded-lg" />
});

interface AddLibraryFormProps {
    onClose: () => void;
    userLocation: [number, number] | null;
    initialData?: Library;
}

export default function AddLibraryForm({ onClose, userLocation, initialData }: AddLibraryFormProps) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setIsAuthenticated(true);
            }
            setCheckingAuth(false);
        }
        checkAuth();
    }, [supabase]);

    const [position, setPosition] = useState<[number, number]>(
        initialData ? [initialData.latitude, initialData.longitude] : (userLocation || [-33.8688, 151.2093])
    );
    const [photoPreview, setPhotoPreview] = useState<string>(initialData?.photoUrl || '');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isAuthenticated) return;
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            name: formData.get('name'),
            description: formData.get('description'),
            latitude: position[0],
            longitude: position[1],
            photoUrl: photoPreview,
        };

        try {
            const url = initialData ? `/api/libraries/${initialData.id}` : '/api/libraries';
            const method = initialData ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                toast.success(initialData ? 'Library updated!' : 'Library added!');
                router.refresh();
                onClose();
            } else {
                toast.error('Something went wrong.');
            }
        } catch (error) {
            console.error('Error saving library:', error);
            toast.error('Failed to save library.');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUseMyLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((pos) => {
                setPosition([pos.coords.latitude, pos.coords.longitude]);
            });
        }
    };

    if (checkingAuth) {
        return null; // Or a spinner
    }

    if (!isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white w-full max-w-sm rounded-2xl p-6 text-center">
                    <h2 className="text-xl font-bold mb-2">Sign in Required</h2>
                    <p className="text-gray-600 mb-6">You need to be signed in to add or edit a library.</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">
                            Cancel
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
                    <h2 className="text-xl font-bold">{initialData ? 'Edit Library' : 'Add Street Library'}</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            name="name"
                            required
                            defaultValue={initialData?.name}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Sunny Side Library"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            name="description"
                            defaultValue={initialData?.description}
                            className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                            rows={3}
                            placeholder="Tell us about this library..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Photo</label>
                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            {photoPreview ? (
                                <img src={photoPreview} alt="Preview" className="h-40 mx-auto object-cover rounded-lg" />
                            ) : (
                                <div className="text-gray-500">
                                    <Upload className="mx-auto mb-2" />
                                    <span className="text-sm">Tap to upload photo</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <div className="mb-2">
                            <LocationPicker position={position} onPositionChange={setPosition} />
                        </div>
                        <button
                            type="button"
                            onClick={handleUseMyLocation}
                            className="text-blue-600 text-sm font-medium flex items-center gap-1 hover:underline"
                        >
                            <MapPin size={16} /> Use my current location
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
                    >
                        {loading && <Loader2 className="animate-spin" />}
                        {initialData ? 'Save Changes' : 'Add Library'}
                    </button>
                </form>
            </div>
        </div>
    );
}
