import numpy as np
from typing import List, Dict
import map_processes as map
import cv2
from utils import show
from typing import Tuple


# scripts/notebooks/utils/fake_province_detection.ipynb
def find_fake_provinces(
    bitmap: np.ndarray,
    province_data_views: list,
    quantization_config: map.QuantizationConfig,
    debug=False,
) -> List[int]:
    colors = np.unique(bitmap.reshape(-1, bitmap.shape[2]), axis=0)
    bitmap_hashes = [
        map.get_quantized_value(color, quantization_config) for color in colors
    ]

    # Handle VOID Province
    if 0 not in bitmap_hashes:
        bitmap_hashes.append(0)

    json_hashes = [
        province_data_view.hash for province_data_view in province_data_views
    ]
    diff = np.setdiff1d(json_hashes, bitmap_hashes)

    if debug:
        print("Bitmap hashes:", len(bitmap_hashes))
        print("Json hashes:", len(json_hashes))
        print("Diff:", len(diff))

    return diff


# scripts/notebooks/utils/province_json_remover.ipynb
def remove_ids_from_provinces_list(
    ids_to_remove: List[int],
    provinces: List[map.ProvinceDataView],
    remove_from_provinces_list=False,
    remove_from_neighbors=False,
) -> List[map.ProvinceDataView]:
    output = provinces.copy()

    if remove_from_provinces_list:
        output = [
            province for province in provinces if province.id not in ids_to_remove
        ]
        print("Removed from provinces list : ", len(provinces) - len(output))

    if remove_from_neighbors:
        for province in output:
            province.landNeighbours = [
                neighbor
                for neighbor in province.landNeighbours
                if neighbor not in ids_to_remove
            ]

    return output
