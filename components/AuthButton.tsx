'use client';

import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';

export default function AuthButton() {
    const supabase = createClient();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
        };
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    if (!user) {
        return (
            <Link
                href="/login"
                className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-full font-semibold shadow-sm hover:bg-gray-50 transition-colors"
            >
                <UserIcon size={18} />
                Sign In
            </Link>
        );
    }

    return (
        <div className="flex items-center gap-3">
            <div className="hidden sm:block text-sm font-medium text-gray-700">
                {user.email}
            </div>
            <button
                onClick={handleSignOut}
                className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors"
            >
                <LogOut size={18} />
                <span className="hidden sm:inline">Sign Out</span>
            </button>
        </div>
    );
}
