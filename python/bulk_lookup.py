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


if __name__ == "__main__":
    data = bulk_lookup(NPIS)
    counts = data["meta"]["counts"]
    print(f"Requested: {counts['requested']}, Found: {counts['found']}, Not found: {counts['notFound']}")
    print(data)
