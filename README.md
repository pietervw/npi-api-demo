# Health Provider NPI API — SDK Examples

<!-- Logo -->
<p align="center">
  <img src="docs/icon.png" alt="Health Provider NPI API" width="120" />
</p>

<!-- Badges -->
<p align="center">
  <!-- Language count -->
  <img src="https://img.shields.io/github/languages/count/pietervw/npi-api-demo?style=flat-square&color=1E88E5" alt="Languages" />
  <!-- License -->
  <img src="https://img.shields.io/github/license/pietervw/npi-api-demo?style=flat-square&color=1E88E5" alt="License" />
  <!-- Workflow Status -->
  <img src="https://img.shields.io/github/actions/workflow/status/pietervw/npi-api-demo/validate.yml?style=flat-square&color=1E88E5" alt="Validate" />
</p>

> Working code samples for the [Health Provider NPI API](https://healthproviderapi.com) — the authoritative US healthcare provider lookup service powered by the NPPES registry.
>
> This repo gives developers everything needed to integrate NPI lookup, provider search, and bulk NPI retrieval into any application in Python, Node.js, or C#.

## What is the Health Provider NPI API?

The Health Provider NPI API provides programmatic access to the **National Plan & Provider Enumeration System (NPPES)** — the official US government registry of assigned **NPI numbers** for healthcare providers and organizations.

NPI numbers are unique 10-digit identifiers required by HIPAA for all US healthcare providers. This API lets you:

- **Look up a provider** by their NPI number to get credentials, taxonomy, addresses, and status
- **Search providers** by name, organization, location, or specialty
- **Bulk-lookup** up to 50 NPIs in a single request
- **Enrich provider records** with data quality and freshness scores

**[Get a free API key →](https://healthproviderapi.com)**

## Features

- ✅ **Single NPI Lookup** — `GET /api/v1/npi/{npi}` — retrieve a provider by their 10-digit NPI
- ✅ **Provider Directory Search** — `GET /api/v1/providers/search` — find providers by name, organization, city, state, or specialty
- ✅ **Bulk NPI Lookup** — `POST /api/v1/npi/bulk` — batch lookup up to 50 NPIs per request
- ✅ **Health Check** — `GET /api/health` — verify API availability (no auth required)
- ✅ **Error handling** — structured errors for 400, 401, 403, 404, 429, 500, 502 responses
- ✅ **Rate-limit awareness** — reads `X-RateLimit-*` headers and retries with backoff
- ✅ **Real NPI numbers** — all examples use real, publicly available NPI numbers from the NPPES registry
- ✅ **Enrichment support** — request `completeness`, `quality_score`, and `freshness` enrichment on Growth and Pro plans

## Supported Languages

| Language | Runtime | HTTP Client | Sample |
|---|---|---|---|
| **Node.js** | 18+ | Native `fetch` | [`node/single-lookup.js`](node/single-lookup.js) |
| **TypeScript** | 5+ | Native `fetch` | [`typescript/single-lookup.ts`](typescript/single-lookup.ts) |
| **Python** | 3.10+ | `httpx` | [`python/single_lookup.py`](python/single_lookup.py) |
| **C# / .NET** | 10+ | `HttpClient` | [`csharp/Program.cs`](csharp/Program.cs) |

## Quick Start

### 1. Get your API key

Sign up at **[healthproviderapi.com](https://healthproviderapi.com)** to get a free API key.

### 2. Clone the repo

```bash
git clone https://github.com/pietervw/npi-api-demo.git
cd npi-api-demo
```

### 3. Configure environment

Copy `.env.example` to `.env` and set your API key:

```bash
# Linux / macOS
cp .env.example .env

# Windows (PowerShell)
Copy-Item .env.example .env
```

Edit `.env`:
```
NPI_API_KEY=your_api_key_here
NPI_API_BASE_URL=https://healthproviderapi.com
```

---

### Node.js

```bash
cd node
npm install
node single-lookup.js
node search.js
node bulk-lookup.js
node health.js
```

### TypeScript

```bash
cd typescript
npm install
npx tsx single-lookup.ts
npx tsx search.ts
npx tsx bulk-lookup.ts
npx tsx health.ts
```

### Python

```bash
cd python
pip install -r requirements.txt
python single_lookup.py
python search.py
python bulk_lookup.py
python health.py
```

### C# / .NET

```bash
cd csharp
dotnet restore
dotnet run
```

---

## Code Examples

### Single NPI Lookup

Look up a provider by their 10-digit NPI number. Returns provider name, credentials, taxonomy, addresses, and enumeration status.

<!-- single-lookup examples -->
<details>
<summary><strong>Node.js</strong></summary>

```javascript
// node/single-lookup.js
import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';
const NPI = '1003000126';  // Real NPI from NPPES registry

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
```
</details>

<details>
<summary><strong>TypeScript</strong></summary>

```typescript
// typescript/single-lookup.ts
import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY!;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';
const NPI = '1003000126';

interface ProviderData {
  npi: string;
  entityType: string;
  status: string;
  name: {
    full: string | null;
    first: string | null;
    last: string | null;
    credential: string | null;
  };
  primaryTaxonomy: {
    code: string;
    description: string;
  } | null;
  mailingAddress: Record<string, unknown> | null;
  enumerationDate: string | null;
}

async function lookupNpi(npi: string): Promise<{ data: ProviderData }> {
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

  return res.json() as { data: ProviderData };
}

lookupNpi(NPI).then(data => console.log(JSON.stringify(data, null, 2))).catch(console.error);
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
# python/single_lookup.py
import os
import httpx

API_KEY = os.environ["NPI_API_KEY"]
BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")
NPI = "1003000126"  # Real NPI from NPPES registry

def lookup_npi(npi: str) -> dict:
    response = httpx.get(
        f"{BASE_URL}/api/v1/npi/{npi}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()

data = lookup_npi(NPI)
print(data)
```
</details>

<details>
<summary><strong>C# / .NET</strong></summary>

```csharp
// csharp/Program.cs (see full file for all examples)
using System.Net.Http.Json;

var API_KEY = Environment.GetEnvironmentVariable("NPI_API_KEY")!;
var BASE_URL = Environment.GetEnvironmentVariable("NPI_API_BASE_URL") ?? "https://healthproviderapi.com";
var NPI = "1003000126";

async Task LookupNpi(string npi)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var response = await client.GetAsync($"{BASE_URL}/api/v1/npi/{npi}");
    response.EnsureSuccessStatusCode();

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}
```
</details>

---

### Provider Directory Search

Search for providers by name, organization, city, state, or specialty. Supports pagination with `limit` and `skip`.

<!-- search examples -->
<details>
<summary><strong>Node.js</strong></summary>

```javascript
// node/search.js
import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

async function searchProviders({ lastName, state, city, limit = 10 }) {
  const params = new URLSearchParams({ last_name: lastName });
  if (state)  params.set('state', state);
  if (city)   params.set('city', city);
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
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
# python/search.py
import os
import httpx

API_KEY = os.environ["NPI_API_KEY"]
BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")

def search_providers(last_name: str, state: str | None = None, city: str | None = None, limit: int = 10) -> dict:
    params = {"last_name": last_name, "limit": limit}
    if state:
        params["state"] = state
    if city:
        params["city"] = city

    response = httpx.get(
        f"{BASE_URL}/api/v1/providers/search",
        params=params,
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()

data = search_providers(last_name="SMITH", state="DC", limit=5)
print(f"Found {len(data['data'])} providers")
print(data)
```
</details>

<details>
<summary><strong>C# / .NET</strong></summary>

```csharp
// csharp/Program.cs
async Task SearchProviders(string lastName, string? state = null, string? city = null, int limit = 10)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var query = $"last_name={lastName}&limit={limit}";
    if (state != null) query += $"&state={state}";
    if (city != null) query += $"&city={city}";

    var response = await client.GetAsync($"{BASE_URL}/api/v1/providers/search?{query}");
    response.EnsureSuccessStatusCode();

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}
```
</details>

---

### Bulk NPI Lookup

Look up up to 50 NPI numbers in a single request. Each item in the response has its own `status` — `found`, `not_found`, `upstream_error`, or `quota_exceeded`.

<!-- bulk-lookup examples -->
<details>
<summary><strong>Node.js</strong></summary>

```javascript
// node/bulk-lookup.js
import 'dotenv/config';

const API_KEY = process.env.NPI_API_KEY;
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

const NPIS = ['1003000126', '1932100864', '1851789159'];  // Real NPIs from NPPES

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
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
# python/bulk_lookup.py
import os
import httpx

API_KEY = os.environ["NPI_API_KEY"]
BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")
NPIS = ["1003000126", "1932100864", "1851789159"]

def bulk_lookup(npis: list[str]) -> dict:
    response = httpx.post(
        f"{BASE_URL}/api/v1/npi/bulk",
        json={"npis": npis},
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()

data = bulk_lookup(NPIS)
counts = data["meta"]["counts"]
print(f"Requested: {counts['requested']}, Found: {counts['found']}, Not found: {counts['notFound']}")
print(data)
```
</details>

<details>
<summary><strong>C# / .NET</strong></summary>

```csharp
// csharp/Program.cs
async Task BulkLookup(string[] npis)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var payload = new { npis = npis };
    var content = new StringContent(
        System.Text.Json.JsonSerializer.Serialize(payload),
        System.Text.Encoding.UTF8,
        "application/json"
    );

    var response = await client.PostAsync($"{BASE_URL}/api/v1/npi/bulk", content);
    response.EnsureSuccessStatusCode();

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}
```
</details>

---

### Health Check

Verify the API is available. No authentication required.

<!-- health check examples -->
<details>
<summary><strong>Node.js</strong></summary>

```javascript
// node/health.js
const BASE_URL = process.env.NPI_API_BASE_URL || 'https://healthproviderapi.com';

async function healthCheck() {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error(`Health check failed: ${res.status}`);
  const data = await res.json();
  console.log('API is healthy:', JSON.stringify(data));
  return data;
}

healthCheck().catch(err => { console.error(err.message); process.exit(1); });
```
</details>

<details>
<summary><strong>Python</strong></summary>

```python
# python/health.py
import os
import httpx

BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")

def health_check() -> dict:
    response = httpx.get(f"{BASE_URL}/api/health", timeout=10.0)
    response.raise_for_status()
    return response.json()

data = health_check()
print("API is healthy:", data)
```
</details>

<details>
<summary><strong>C# / .NET</strong></summary>

```csharp
// csharp/Program.cs
async Task HealthCheck()
{
    using var client = new HttpClient();
    var response = await client.GetAsync($"{BASE_URL}/api/health");
    response.EnsureSuccessStatusCode();

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine("API is healthy: " + data?.RootElement.GetRawText());
}
```
</details>

---

## Endpoints Covered

### `GET /api/v1/npi/{npi}`

Look up a single healthcare provider by their 10-digit NPI number. Returns normalized provider data including name, credentials, taxonomy classifications, mailing address, practice locations, and enumeration date. Supports optional `enrichment` header for data quality and freshness scores on Growth and Pro plans.

**Learn more →** [API Documentation](https://docs.healthproviderapi.com)

### `GET /api/v1/providers/search`

Search the NPPES provider directory by name, organization, city, state, or specialty. At least `last_name` or `organization_name` is required. Results are paginated with `limit` (max 50) and `skip` (max 1000). Each successful search consumes one monthly quota credit.

**Learn more →** [API Documentation](https://docs.healthproviderapi.com)

### `POST /api/v1/npi/bulk`

Look up up to 50 NPI numbers in a single batch request. Each item in the response has its own `status` field (`found`, `not_found`, `upstream_error`, `quota_exceeded`). Duplicates in a single batch are metered independently. Quota is consumed per-item.

**Learn more →** [API Documentation](https://docs.healthproviderapi.com)

### `GET /api/health`

Returns the API service health status. No authentication required. Use this to verify the service is available before making authenticated requests.

**Learn more →** [API Documentation](https://docs.healthproviderapi.com)

---

## Resources

- [API Documentation](https://docs.healthproviderapi.com) — Full API reference
- [Health Provider NPI API](https://healthproviderapi.com) — Sign up for an API key
- [Main API Repository](https://github.com/pietervw/NPI-API) — Backend implementation
- [NPPES Registry](https://npiregistry.cms.hhs.gov/) — Official US government NPI registry
- [HIPAA NPI Requirement](https://www.cms.gov/Regulations-and-Guidance/HIPAA-Administrative-Simplification/NationalProviderIdentStand) — Learn why NPI numbers are required

## Contributing

Contributions are welcome! Please open an issue before submitting a pull request for significant changes.

### Guidelines

- All code must be **self-contained and runnable** — no build steps beyond what is standard for the language
- Examples must use **real, publicly available NPI numbers** from the NPPES registry
- Add one file per language when adding a new example
- Keep error messages consistent across languages
- New language support requires: source files, `package.json` / `requirements.txt` / `.csproj` as appropriate, and CI job entries

## License

MIT License — see [LICENSE](LICENSE) for details.
