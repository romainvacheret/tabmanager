from typing import Optional
from manager.storage import StoredData


def store_scollection(collection_name: str, urls: list[str]) -> bool:
    try:
        StoredData().write_collection(collection_name, urls)

    except KeyError as e:
        print(f'Error: {e}')
        return False
    return True


def retrieve_collection(collection_name: str) -> Optional[list[str]]:
    try:
        return StoredData().collections.get(collection_name)
    except KeyError:
        print(f'Collection: {collection_name} not found')
        return []
