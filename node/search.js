import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

async function searchProviders({ lastName, state, city, limit = 10 }) {
  const params = new URLSearchParams({ last_name: lastName });
  if (state) params.set('state', state);
  if (city) params.set('city', city);
  params.set('limit', String(limit));

  const res = await fetch(`${BASE_URL}/api/v1/providers/search?${params}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(`API error ${res.status}: ${body.error.code} — ${body.error.message}`);
  }

  const data = await res.json();
  console.log(`Found ${data.data.length} providers`);
  console.log(JSON.stringify(data, null, 2));
  return data;
}

searchProviders({ lastName: 'SMITH', state: 'DC', limit: 5 }).catch(console.error);
