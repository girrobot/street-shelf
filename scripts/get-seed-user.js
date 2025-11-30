const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase URL or Key');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function getSeedUser() {
    const email = 'seed-user@example.com';
    const password = 'SeedPassword123!';

    // Try to sign in first
    let { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        // If sign in fails, try to sign up
        console.log('User not found or sign in failed, trying to sign up...');
        const signUpResult = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpResult.error) {
            console.error('Sign up failed:', signUpResult.error.message);
            return;
        }

        data = signUpResult.data;
    }

    if (data.user) {
        console.log('SEED_USER_ID:', data.user.id);
    } else {
        console.error('Could not get user ID');
    }
}

getSeedUser();
