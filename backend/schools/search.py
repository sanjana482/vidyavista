"""
Meilisearch integration. Everything here degrades gracefully: if MEILISEARCH_URL is empty or the server is down,
search_ids() returns None and the API falls back to a normal PostgreSQL search.
"""
import logging

from django.conf import settings

logger = logging.getLogger(__name__)
INDEX_UID = "schools"
SEARCHABLE = ["name", "area", "city", "state", "board", "type", "facilities"]


def _client():
    if not settings.MEILISEARCH_URL:
        return None
    import meilisearch

    return meilisearch.Client(settings.MEILISEARCH_URL, settings.MEILISEARCH_API_KEY or None, timeout=3)


def to_document(school) -> dict:
    return {
        "id": school.pk,
        "name": school.name,
        "area": school.area,
        "city": school.city,
        "state": school.state,
        "board": school.board,
        "type": school.type,
        "facilities": list(school.facilities or []),
        "is_active": school.is_active,
    }


def configure_index():
    client = _client()
    if not client:
        return None
    client.create_index(INDEX_UID, {"primaryKey": "id"})
    index = client.index(INDEX_UID)
    index.update_searchable_attributes(SEARCHABLE)
    index.update_filterable_attributes(["is_active", "city", "state", "board", "type"])
    return index


def upsert(school):
    client = _client()
    if client:
        client.index(INDEX_UID).add_documents([to_document(school)], primary_key="id")


def remove(pk):
    client = _client()
    if client:
        client.index(INDEX_UID).delete_document(pk)


def reindex_all(queryset) -> int:
    client = _client()
    if not client:
        return 0
    configure_index()
    docs = [to_document(s) for s in queryset]
    if docs:
        client.index(INDEX_UID).add_documents(docs, primary_key="id")
    return len(docs)


def search_ids(query: str, limit: int = 1000):
    """Ranked list of school ids for a text query (typo tolerant), or None when search is unavailable."""
    client = _client()
    if not client:
        return None
    try:
        res = client.index(INDEX_UID).search(query, {"limit": limit, "attributesToRetrieve": ["id"], "filter": "is_active = true"})
        return [int(h["id"]) for h in res["hits"]]
    except Exception as exc:  # Meilisearch down / index missing -> use the database instead
        logger.warning("Meilisearch unavailable, using database search: %s", exc)
        return None
