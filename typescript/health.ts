const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

interface HealthResponse {
  status: string;
  timestamp: string;
  version?: string;
  upstream?: string;
}

async function healthCheck(): Promise<HealthResponse> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  return res.json() as Promise<HealthResponse>;
}

healthCheck()
  .then(data => {
    console.log('API is healthy:', JSON.stringify(data));
  })
  .catch(err => {
    console.error(err.message);
    process.exit(1);
  });
