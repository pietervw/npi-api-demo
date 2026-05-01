import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY!;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';
const NPIS = ['1003000126', '1932100864', '1851789159'];

interface BulkItemResult {
  npi: string;
  status: 'found' | 'not_found' | 'upstream_error' | 'quota_exceeded';
  provider: unknown;
  cached: boolean;
  requestId: string;
  error: { code: string; message: string } | null;
}

interface BulkCounts {
  requested: number;
  found: number;
  notFound: number;
  upstreamErrors: number;
  quotaExceeded: number;
  cacheHits: number;
}

interface BulkMeta {
  requestId: string;
  counts: BulkCounts;
}

interface BulkLookupResponse {
  data: BulkItemResult[];
  meta: BulkMeta;
}

async function bulkLookup(npis: string[]): Promise<BulkLookupResponse> {
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
    const body = await res.json() as { error: { code: string; message: string } };
    throw new Error(`API error ${res.status}: ${body.error.code} — ${body.error.message}`);
  }

  return res.json() as Promise<BulkLookupResponse>;
}

bulkLookup(NPIS).then(data => {
  const { counts } = data.meta;
  console.log(`Requested: ${counts.requested}, Found: ${counts.found}, Not found: ${counts.notFound}`);
  console.log(JSON.stringify(data, null, 2));
}).catch(console.error);
