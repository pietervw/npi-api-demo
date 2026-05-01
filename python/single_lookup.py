import os
import httpx

API_KEY = os.environ["NPI_API_KEY"]
BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")
NPI = "1003000126"


def lookup_npi(npi: str) -> dict:
    response = httpx.get(
        f"{BASE_URL}/api/v1/npi/{npi}",
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    data = lookup_npi(NPI)
    print(data)
