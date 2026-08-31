# AGENTS.md

Multi-language SDK example repo for the Health Provider NPI API
(healthproviderapi.com). Four parallel, self-contained demos: Node.js,
TypeScript, Python, C#.

## Setup and exact commands

All demos need `NPI_API_KEY` (free key from healthproviderapi.com);
`NPI_API_BASE_URL` defaults to `https://healthproviderapi.com`.

- Node.js: `cd node && npm install && node health.js` (also `single-lookup.js`,
  `search.js`, `bulk-lookup.js`). Loads `.env` from `node/` via dotenv.
- TypeScript: `cd typescript && npm install && npx tsx health.ts` (also
  `single-lookup.ts`, `search.ts`, `bulk-lookup.ts`). Loads `.env` from
  `typescript/`.
- Python: `cd python && pip install -r requirements.txt && python health.py`
  (also `single_lookup.py`, `search.py`, `bulk_lookup.py`). Reads OS env vars
  only — no `.env` auto-load.
- C#: `cd csharp && dotnet restore && dotnet run`. Reads OS env vars only.

There is no root package.json and no lint/typecheck/test/build steps exist in
any language folder; see Verification matrix for how changes are validated.

## Architecture map

- `node/`, `typescript/`, `python/`, `csharp/` — four independent demos, one
  file per endpoint per language. No shared code between folders.
- Each endpoint maps to: `GET /api/v1/npi/{npi}`,
  `GET /api/v1/providers/search`, `POST /api/v1/npi/bulk` (max 50 NPIs),
  `GET /api/health` (no auth).
- `.github/workflows/validate.yml` — CI runs every example against the
  production API using the `DEMO_API_KEY` secret.
- `README.md` is the product surface: code examples are mirrored there when
  endpoints/languages change.

## Important invariants and safety constraints

- Never commit API keys; `.env` files stay local (`.env.example` is the
  template).
- Demos stay minimal and runnable as-is: no build steps, no shared libraries,
  no over-engineering.
- Use real, publicly available NPI numbers from the NPPES registry — never
  fake data.
- Node/TS: ESM, native `fetch` only. Python: 3.10+, `httpx`, type hints.
  C#: .NET 8, top-level statements, `HttpClient` + `System.Text.Json`.
- Keep error messages consistent across languages for the same scenario.
- Small, predictable functions; keep sample docs claims (e.g. `.env` loading)
  accurate to what the sample actually does.

## Verification matrix

- No lint/typecheck/unit tests exist in this repo.
- CI (`.github/workflows/validate.yml`) executes all examples per language
  against production; PRs failing CI are not merged.
- Local smoke test before pushing: run `health` + `single-lookup` in the
  language you touched with a valid `NPI_API_KEY`.
- README review: if you changed a sample, the README code block must match.

## Deployment and post-deployment checks

- No deploy: this is a static examples repo; GitHub README is the surface.
- Post-merge: confirm the Validate badge on `main` is green.

## Known non-obvious gotchas

- Node/TS samples load `.env` from the current working directory — run them
  from inside `node/` or `typescript/`, or the key appears missing.
- Python/C# do NOT auto-load `.env`; export env vars in the shell first.
- Bulk lookup is metered per item (duplicates metered independently); each
  search consumes one monthly quota credit — don't hammer CI with edits that
  add extra example runs.
- TypeScript runs via `tsx` (no compiled output is committed for the TS demos).

## Definition of done

- Verification green (CI validate workflow passes; local smoke run done for
  touched languages).
- PR opened for Pete to merge — the merge is the deploy trigger; never push
  `main` directly.
- Soft target: under 400 changed lines per PR.
- README updated when samples change; no secrets committed.
