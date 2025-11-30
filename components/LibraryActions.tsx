'use client';

import { useRouter } from 'next/navigation';
import { Edit, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LibraryActions({ id }: { id: string }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this library?')) {
            return;
        }

        try {
            const res = await fetch(`/api/libraries/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Library deleted');
                router.push('/');
                router.refresh();
            } else {
                toast.error('Failed to delete library');
            }
        } catch (error) {
            console.error('Error deleting library:', error);
            toast.error('Error deleting library');
        }
    };

    return (
        <div className="flex gap-3 mt-6 border-t pt-6">
            <button
                onClick={() => router.push(`/libraries/${id}/edit`)}
                className="flex-1 flex items-center justify-center gap-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
                <Edit size={18} />
                Edit
            </button>
            <button
                onClick={handleDelete}
                className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-3 rounded-xl font-semibold hover:bg-red-100 transition-colors"
            >
                <Trash2 size={18} />
                Delete
            </button>
        </div>
    );
}
