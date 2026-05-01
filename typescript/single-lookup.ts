import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY!;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';
const NPI = '1003000126';

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

interface ResponseMeta {
  requestId: string;
  cached: boolean;
  enrichment?: {
    requested: string[];
    applied: string[];
    creditCost: number;
    nonVerification: boolean;
  };
}

interface NpiLookupResponse {
  data: ProviderData;
  meta: ResponseMeta;
}

async function lookupNpi(npi: string): Promise<NpiLookupResponse> {
  const res = await fetch(`${BASE_URL}/api/v1/npi/${npi}`, {
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Accept': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.json() as { error: { code: string; message: string } };
    throw new Error(`API error ${res.status}: ${body.error.code} — ${body.error.message}`);
  }

  return res.json() as Promise<NpiLookupResponse>;
}

lookupNpi(NPI).then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
