import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';
const NPI = '1003000126';

async function lookupNpi(npi) {
  const res = await fetch(`${BASE_URL}/api/v1/npi/${npi}`, {
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
  console.log(JSON.stringify(data, null, 2));
  return data;
}

lookupNpi(NPI).catch(console.error);
