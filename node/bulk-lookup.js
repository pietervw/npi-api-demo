import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

const NPIS = ['1003000126', '1932100864', '1851789159'];

async function bulkLookup(npis) {
  const res = await fetch(`${BASE_URL}/api/v1/npi/bulk`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({ npis }),
  });

  if (!res.ok) {
    const body = await res.json();
    throw new Error(`API error ${res.status}: ${body.error.code} — ${body.error.message}`);
  }

  const data = await res.json();
  const counts = data.meta.counts;
  console.log(`Requested: ${counts.requested}, Found: ${counts.found}, Not found: ${counts.notFound}`);
  console.log(JSON.stringify(data, null, 2));
  return data;
}

bulkLookup(NPIS).catch(console.error);
