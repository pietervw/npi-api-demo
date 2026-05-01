using System.Net.Http.Json;
using System.Text.Json;

var BASE_URL = Environment.GetEnvironmentVariable("NPI_API_BASE_URL") ?? "https://healthproviderapi.com";
var API_KEY = Environment.GetEnvironmentVariable("NPI_API_KEY") ?? throw new InvalidOperationException("NPI_API_KEY is required");
var NPI = "1003000126";
var NPIS = new[] { "1003000126", "1932100864", "1851789159" };

// ---------------------------------------------------------------------------
// Health Check — no auth required
// ---------------------------------------------------------------------------
async Task HealthCheck()
{
    using var client = new HttpClient();
    var response = await client.GetAsync($"{BASE_URL}/api/health");
    response.EnsureSuccessStatusCode();
    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine("API is healthy: " + data?.RootElement.GetRawText());
}

// ---------------------------------------------------------------------------
// Single NPI Lookup
// ---------------------------------------------------------------------------
async Task LookupNpi(string npi)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var response = await client.GetAsync($"{BASE_URL}/api/v1/npi/{npi}");

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadFromJsonAsync<JsonDocument>();
        var code = error?.RootElement.GetProperty("error").GetProperty("code").GetString();
        var message = error?.RootElement.GetProperty("error").GetProperty("message").GetString();
        throw new Exception($"API error {response.StatusCode}: {code} — {message}");
    }

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}

// ---------------------------------------------------------------------------
// Provider Search
// ---------------------------------------------------------------------------
async Task SearchProviders(string lastName, string? state = null, string? city = null, int limit = 10)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var query = $"last_name={lastName}&limit={limit}";
    if (state != null) query += $"&state={state}";
    if (city != null) query += $"&city={city}";

    var response = await client.GetAsync($"{BASE_URL}/api/v1/providers/search?{query}");

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadFromJsonAsync<JsonDocument>();
        var code = error?.RootElement.GetProperty("error").GetProperty("code").GetString();
        var message = error?.RootElement.GetProperty("error").GetProperty("message").GetString();
        throw new Exception($"API error {response.StatusCode}: {code} — {message}");
    }

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}

// ---------------------------------------------------------------------------
// Bulk NPI Lookup
// ---------------------------------------------------------------------------
async Task BulkLookup(string[] npis)
{
    using var client = new HttpClient();
    client.DefaultRequestHeaders.Authorization =
        new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", API_KEY);

    var payload = new { npis = npis };
    var json = JsonSerializer.Serialize(payload);
    using var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

    var response = await client.PostAsync($"{BASE_URL}/api/v1/npi/bulk", content);

    if (!response.IsSuccessStatusCode)
    {
        var error = await response.Content.ReadFromJsonAsync<JsonDocument>();
        var code = error?.RootElement.GetProperty("error").GetProperty("code").GetString();
        var message = error?.RootElement.GetProperty("error").GetProperty("message").GetString();
        throw new Exception($"API error {response.StatusCode}: {code} — {message}");
    }

    var data = await response.Content.ReadFromJsonAsync<JsonDocument>();
    Console.WriteLine(data?.RootElement.GetRawText());
}

// ---------------------------------------------------------------------------
// Run all demos
// ---------------------------------------------------------------------------
Console.WriteLine("=== Health Check ===");
await HealthCheck();

Console.WriteLine("\n=== Single NPI Lookup ===");
await LookupNpi(NPI);

Console.WriteLine("\n=== Provider Search ===");
await SearchProviders("SMITH", state: "DC", limit: 5);

Console.WriteLine("\n=== Bulk NPI Lookup ===");
await BulkLookup(NPIS);
