const jwt = require('jsonwebtoken');

// Load env vars from .env if available (optional, for convenience)
// require('dotenv').config(); 

const keyId = process.env.APPLE_KEY_ID;
const teamId = process.env.APPLE_TEAM_ID;
const clientId = process.env.APPLE_CLIENT_ID; // This is your Service ID (e.g. com.example.app.service)
const privateKey = process.env.APPLE_PRIVATE_KEY ? process.env.APPLE_PRIVATE_KEY.replace(/\\n/g, '\n') : null;

if (!keyId || !teamId || !clientId || !privateKey) {
    console.error('Error: Missing environment variables.');
    console.error('Usage: APPLE_KEY_ID=... APPLE_TEAM_ID=... APPLE_CLIENT_ID=... APPLE_PRIVATE_KEY="..." node scripts/generate-apple-secret.js');
    process.exit(1);
}

try {
    const token = jwt.sign(
        {
            iss: teamId,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + (86400 * 180), // 6 months (max allowed by Apple)
            aud: 'https://appleid.apple.com',
            sub: clientId
        },
        privateKey,
        {
            algorithm: 'ES256',
            header: {
                kid: keyId,
                typ: undefined // Apple implies no 'typ' header is preferred or 'JWT' is fine. keeping it simple.
            }
        }
    );

    console.log('\n--- Apple Client Secret (JWT) ---');
    console.log(token);
    console.log('---------------------------------\n');
    console.log('Copy the token above and paste it into the "Secret Key" field in Supabase.');

} catch (error) {
    console.error('Error generating token:', error.message);
}
