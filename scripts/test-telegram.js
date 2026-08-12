import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read .env manually
const envPath = path.join(__dirname, '..', 'osis-smait-fi', '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
    const parts = line.split('=');
    if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join('=').trim();
        env[key] = value;
    }
});

const token = env['TELEGRAM_BOT_TOKEN'];
const chatId = env['TELEGRAM_CHAT_ID'];

console.log('Testing Telegram Bot Creds:');
console.log('Token:', token ? `${token.substring(0, 10)}...` : 'undefined');
console.log('Chat ID:', chatId);

if (!token || !chatId) {
    console.error('Credentials missing');
    process.exit(1);
}

async function testSend() {
    try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: 'Hello from AgoraActa Website Debugger! Telegram Bot Log test.',
                parse_mode: 'Markdown',
            }),
        });

        const data = await res.json();
        console.log('Response Status:', res.status);
        console.log('Response Body:', data);
    } catch (err) {
        console.error('Fetch Error:', err);
    }
}

testSend();
