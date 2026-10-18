import crypto from 'node:crypto';

const { CLOUDINARY_CLOUD_NAME: cloud, CLOUDINARY_API_KEY: key, CLOUDINARY_API_SECRET: secret } = process.env;
const timestamp = Math.floor(Date.now() / 1000);
const signature = crypto.createHash('sha1').update(`timestamp=${timestamp}${secret}`).digest('hex');

const png = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';

const form = new FormData();
form.append('file', png);
form.append('api_key', key);
form.append('timestamp', String(timestamp));
form.append('signature', signature);

const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud}/image/upload`, { method: 'POST', body: form });
console.log('status:', res.status);
console.log('headers:', Object.fromEntries(res.headers));
console.log('body:', await res.text());