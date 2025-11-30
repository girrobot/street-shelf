import { Library } from '@/types';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

interface LibraryListProps {
    libraries: Library[];
}

export default function LibraryList({ libraries }: LibraryListProps) {
    return (
        <div className="bg-white p-4 rounded-t-3xl -mt-4 relative z-10 shadow-lg min-h-[50vh]">
            <h2 className="text-2xl font-bold mb-4 px-2">Nearby Libraries</h2>
            <div className="space-y-4">
                {libraries.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">No libraries found nearby.</p>
                ) : (
                    libraries.map((lib) => (
                        <Link
                            key={lib.id}
                            href={`/libraries/${lib.id}`}
                            className="block p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-blue-200 transition-colors"
                        >
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 p-2 rounded-full text-blue-600 shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg text-gray-900">{lib.name}</h3>
                                    <p className="text-gray-500 text-sm line-clamp-2 mt-1">{lib.description}</p>
                                </div>
                            </div>
                        </Link>
                    ))
                )}
            </div>
        </div>
    );
}
