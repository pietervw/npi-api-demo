import os
import httpx

API_KEY = os.environ["NPI_API_KEY"]
BASE_URL = os.environ.get("NPI_API_BASE_URL", "https://healthproviderapi.com")


def search_providers(
    last_name: str,
    state: str | None = None,
    city: str | None = None,
    first_name: str | None = None,
    organization_name: str | None = None,
    postal_code: str | None = None,
    taxonomy_description: str | None = None,
    limit: int = 10,
    skip: int | None = None,
) -> dict:
    params: dict[str, str | int] = {"last_name": last_name, "limit": limit}
    if first_name:
        params["first_name"] = first_name
    if organization_name:
        params["organization_name"] = organization_name
    if city:
        params["city"] = city
    if state:
        params["state"] = state
    if postal_code:
        params["postal_code"] = postal_code
    if taxonomy_description:
        params["taxonomy_description"] = taxonomy_description
    if skip is not None:
        params["skip"] = skip

    response = httpx.get(
        f"{BASE_URL}/api/v1/providers/search",
        params=params,
        headers={"Authorization": f"Bearer {API_KEY}"},
        timeout=30.0,
    )
    response.raise_for_status()
    return response.json()


if __name__ == "__main__":
    data = search_providers(last_name="SMITH", state="DC", limit=5)
    print(f"Found {len(data['data'])} providers")
    print(data)
