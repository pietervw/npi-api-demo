import 'dotenv/config';

const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

async function healthCheck() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  const data = await res.json();
  console.log('API is healthy:', JSON.stringify(data));
  return data;
}

healthCheck().catch(err => { console.error(err.message); process.exit(1); });
