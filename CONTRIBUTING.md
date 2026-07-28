# Contributing to npi-api-demo

We welcome contributions! This repo is intentionally simple — the goal is working, self-contained code examples that any developer can copy-paste and run.

## How to Contribute

### Reporting Issues

- Check if an issue already exists before opening a new one
- For API bugs, include the NPI number, request ID from response headers, and the full error response
- For demo issues, include your language version, runtime version, and the exact error message

### Submitting Changes

1. **Open an issue first** for significant changes (new language support, new endpoint coverage, architectural changes)
2. **Fork the repo** and create a feature branch
3. **Make your changes** — all code must be runnable as-is
4. **Test locally** — run the example and confirm it works against production
5. **Submit a PR** with a clear description of what changed and why

### Code Standards

- All examples must be **self-contained** — no shared library code between language folders
- Use **standard, widely-adopted libraries** for each language (stdlib where possible)
- Include **`if __name__ == "__main__"`** guards in Python
- Use native **`fetch` in Node/TS**, native **`HttpClient` in C#**, **`httpx` in Python**
- Error messages should be **consistent across languages** for the same error scenario
- Use **real, publicly available NPI numbers** from the NPPES registry — never fake data
- Add your example to the **README.md** code sections when adding a new language or endpoint

### Language-Specific Notes

**Node.js / TypeScript**
- ESM (`"type": "module"` in `package.json`)
- Use native `fetch` — no `axios` or `node-fetch`
- TypeScript must be type-safe (strict mode)

**Python**
- Python 3.10+ required (uses `str | None` syntax)
- Use `httpx` for HTTP — no `requests` library
- Use type hints throughout

**C#**
- Top-level statements (no class wrappers)
- Target .NET 8
- Use `HttpClient` with `using` disposal
- Use `System.Text.Json` (not Newtonsoft)

## CI/CD

All pull requests run the validation workflow which executes each language example against the production API. PRs that fail CI will not be merged.

## License

By submitting a contribution, you agree that your code will be licensed under the MIT License.
