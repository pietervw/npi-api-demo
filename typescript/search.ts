import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY!;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

interface SearchParams {
  lastName: string;
  firstName?: string;
  organizationName?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  taxonomyDescription?: string;
  limit?: number;
  skip?: number;
}

interface ProviderName {
  full: string | null;
  first: string | null;
  middle: string | null;
  last: string | null;
  prefix: string | null;
  credential: string | null;
}

interface Taxonomy {
  code: string;
  description: string;
  state: string | null;
  license: string | null;
}

interface Address {
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  country: string | null;
}

interface ProviderData {
  npi: string;
  entityType: string;
  status: string;
  name: ProviderName | null;
  primaryTaxonomy: Taxonomy | null;
  taxonomies: Taxonomy[];
  mailingAddress: Address | null;
  practiceLocations: Address[];
  enumerationDate: string | null;
  lastUpdated: string | null;
  source: { name: string; version: string };
}

interface PaginationMeta {
  limit: number;
  skip: number;
  returned: number;
  hasMore: boolean;
}

interface SearchMeta {
  requestId: string;
  pagination: PaginationMeta;
  enrichment?: unknown;
}

interface SearchResponse {
  data: ProviderData[];
  meta: SearchMeta;
}

async function searchProviders(params: SearchParams): Promise<SearchResponse> {
  const q = new URLSearchParams();
  if (params.lastName) q.set('last_name', params.lastName);
  if (params.firstName) q.set('first_name', params.firstName);
  if (params.organizationName) q.set('organization_name', params.organizationName);
  if (params.city) q.set('city', params.city);
  if (params.state) q.set('state', params.state);
  if (params.postalCode) q.set('postal_code', params.postalCode);
  if (params.taxonomyDescription) q.set('taxonomy_description', params.taxonomyDescription);
  q.set('limit', String(params.limit ?? 10));
  if (params.skip) q.set('skip', String(params.skip));

  const res = await fetch(`${BASE_URL}/api/v1/providers/search?${q}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json() as { error: { code: string; message: string } };
    throw new Error(`API error ${res.status}: ${body.error.code} — ${body.error.message}`);
  }

  return res.json() as Promise<SearchResponse>;
}

searchProviders({ lastName: 'SMITH', state: 'DC', limit: 5 })
  .then(data => {
    console.log(`Found ${data.data.length} providers`);
    console.log(JSON.stringify(data, null, 2));
  })
  .catch(console.error);
