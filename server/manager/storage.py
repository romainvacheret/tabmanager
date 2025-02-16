from pathlib import Path
import yaml
from typing import Final, Optional

CollectionFormat = dict[str, list[str]]
STORAGE_PATH: Final[str] = 'storage.yaml'


class StoredData:
    def __init__(self, file_path: str=STORAGE_PATH) -> None:
        self.collections = read_yaml(file_path) or {}

    def write_to_disk(self) -> bool:
        return write_yaml(self.collections, STORAGE_PATH)

    def write_collection(self, collection: str, urls: list[str]) -> bool:
        self.collections[collection] = urls
        return self.write_to_disk()


def write_yaml(data: CollectionFormat, path: str) -> bool:
    # TODO: check if parent dir exists
    Path(path).touch
    try:
        with open(path, 'w') as file:
            yaml.dump(data, file)
    except Exception as e:
        print('Error: ', e)
        return False

    return True


def read_yaml(path: str) -> Optional[CollectionFormat]:
    try:
        with open(path, 'r') as file:
            data = yaml.safe_load(file)
    except FileNotFoundError as e:
        print(f'File `{path}` does not exist, creating it...')
        Path(path).touch()
        return None
    except yaml.YAMLError as e:
        print(f'Error: {e}')
        return None
    
    return data
