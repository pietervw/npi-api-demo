import os
import httpx

BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")


def health_check() -> dict:
    response = httpx.get(f"{BASE_URL}/api/health", timeout=10.0)
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    data = health_check()
    print("API is healthy:", data)
