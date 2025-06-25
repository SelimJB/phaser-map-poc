import cv2
import utils as ut
import numpy as np
from skimage.util import invert
from shapes import Circle, Ellipse, ProvinceShapeInformation
from typing import List, Tuple


class QuantizationConfig:
    def __init__(self, preciseness=10, use_two_channels=True):
        self.preciseness = preciseness
        self.offset = 255 % self.preciseness
        self.level_count = 1 + 255 // self.preciseness
        self.use_two_channels = use_two_channels

    def show(self):
        print(f"Quantization Configuration:")
        print(f"  Preciseness: {self.preciseness}")
        print(f"  Offset: {self.offset}")
        print(f"  Level Count: {self.level_count}")
        print(f"  Use Two Channels: {self.use_two_channels}")


class ProvinceDataView:
    def __init__(
        self,
        id,
        hash,
        shape_info: ProvinceShapeInformation = None,
        landNeighbours=[],
    ):
        self.id = id
        self.hash = hash
        self.landNeighbours = landNeighbours
        self.shape_info = shape_info

    def show(self):
        print(f"  Hash: {self.hash}")
        print(f"  Land Neighbours: {self.landNeighbours}")
        print(f"  Shape Informations: {self.shape_info}")

    def copy(self):
        return ProvinceDataView(
            self.id,
            self.hash,
            self.shape_info,
            self.landNeighbours.copy(),
        )


def do_map_quantization(
    skeleton: np.ndarray,
    points: List[Tuple[int, int]],
    shape_informations,
    display: bool = False,
    debug: bool = False,
    adjacency_list={},
    quantization_config: QuantizationConfig = QuantizationConfig(),
    font_size: float = 0.4,
    sea_is_top_left: bool = False,
):
    skeleton_uint8 = (invert(skeleton) * 255).astype(np.uint8)
    map_color = cv2.cvtColor(skeleton_uint8, cv2.COLOR_GRAY2BGR)
    province_data_views = [
        ProvinceDataView(
            0,
            0,
            ProvinceShapeInformation((0, 0), Ellipse(), Circle((0, 0), 0)),
        )
    ]

    for j, point in enumerate(points):
        shape_info = shape_informations[j]
        x, y = shape_info.enclosed_circle.center
        index = j
        id = index + 1
        color = get_quantized_color(id, quantization_config)
        provinceDataView = ProvinceDataView(
            id,
            get_quantized_value(color, quantization_config),
            shape_info,
            adjacency_list.get(index, []),
        )
        province_data_views.append(provinceDataView)
        cv2.floodFill(map_color, None, (x, y), color)

    if sea_is_top_left:
        cv2.floodFill(map_color, None, (0, 0), (0, 0, 0))

    map_debug = None
    if debug:
        map_debug = map_color.copy()
        for j, shape_info in enumerate(shape_informations):
            if j == len(shape_informations) - 1:
                x, y = 0, 0
            else:
                x, y = shape_info.enclosed_circle.center
            index = j + 1
            text = f"{province_data_views[index].id}"
            draw_cross(map_debug, (x, y), 3, thickness=1)
            cv2.putText(
                map_debug,
                text,
                (x, y),
                cv2.FONT_HERSHEY_SIMPLEX,
                font_size,
                (255, 255, 255),
                1,
            )
        ut.show(map_debug)

    if display:
        ut.show(map_color)

    return province_data_views, map_color, map_debug


def draw_cross(image: np.ndarray, position: tuple, size: int, color: Tuple[int, int, int] = (0, 0, 255), thickness: int = 1):
    x, y = position
    half_size = size // 2
    cv2.line(image, (x - half_size, y), (x + half_size, y), color, thickness)
    cv2.line(image, (x, y - half_size), (x, y + half_size), color, thickness)


def generate_debug_shape_images(shape_informations: List[ProvinceShapeInformation], skeleton: np.ndarray):
    height, width = skeleton.shape
    # Draw debug images and test if shape_informations are correct
    circle_image = np.zeros((height, width, 3), np.uint8)
    circle_image[:, :, :] = skeleton[:, :, np.newaxis] * 255
    ellipse_image = np.zeros((height, width, 3), np.uint8)
    ellipse_image[:, :, :] = skeleton[:, :, np.newaxis] * 255
    center_image = np.zeros((height, width, 3), np.uint8)
    center_image[:, :, :] = skeleton[:, :, np.newaxis] * 255

    for shape_info in shape_informations:
        # Circles
        shape_info.enclosed_circle.draw(circle_image, (255, 0, 0), 1)
        draw_cross(circle_image, shape_info.enclosed_circle.center,
                   25, (255, 0, 0), 2)
        # Ellipses
        if shape_info.ellipse.center is not None:
            shape_info.ellipse.draw(ellipse_image, (0, 0, 255), 1)
            draw_cross(ellipse_image, shape_info.ellipse.center,
                       25, (0, 0, 255), 2)
        # Centers
        draw_cross(center_image, shape_info.center, 25, (0, 255, 0), 1)
        if shape_info.ellipse.center is not None:
            draw_cross(center_image, shape_info.ellipse.center,
                       25, (0, 0, 255), 1)
        draw_cross(center_image, shape_info.enclosed_circle.center,
                   25, (255, 0, 0), 1)

    return circle_image, ellipse_image, center_image


def debug_duplicated_islands(skeleton, duplicated_contours, display=False):
    # Copy skeleton into a rgb image
    skeleton_rgb = cv2.cvtColor(skeleton.astype(
        np.uint8) * 255, cv2.COLOR_GRAY2RGB)

    for contour_to_remove in duplicated_contours:
        x1 = contour_to_remove[0][0]
        y1 = contour_to_remove[0][1]
        x2 = contour_to_remove[1][0]
        y2 = contour_to_remove[1][1]
        draw_cross(skeleton_rgb, contour_to_remove[2], 20, thickness=3)
        skeleton_rgb[y1][x1] = np.array([255, 0, 0])
        skeleton_rgb[y2][x2] = np.array([0, 255, 0])
        if (x1 == x2) and (y1 == y2):
            print("same point")
            skeleton_rgb[y1][x1] = np.array([255, 255, 0])

    if display:
        ut.show(skeleton_rgb)

    skeleton_rgb = cv2.cvtColor(skeleton_rgb, cv2.COLOR_BGR2RGB)
    return skeleton_rgb


def get_quantized_color(i, config=QuantizationConfig()):
    '''
    Get the quantized color for a given hash i
    '''
    q = config.preciseness
    color_range = 255 - config.offset
    range = color_range + q

    g = (i * q) % range
    r = ((i // config.level_count) * q) % range
    b = (((i // config.level_count) // config.level_count) * q) % range

    return (r, g, b)


def get_quantized_value(color: Tuple[int, int, int], config=QuantizationConfig()):
    '''
    Get the quantized value for a given color (r, g, b)
    '''
    r, g, b = color
    r = int(r / config.preciseness)
    g = int(g / config.preciseness)
    b = int(b / config.preciseness)

    quantization = g + r * config.level_count + b * config.level_count**2

    return quantization


def create_province_json(my_objects: List[ProvinceDataView]):
    for obj in my_objects:
        try:
            obj.shape_info.to_dict()
        except:
            print(obj.id)
            print(obj.shape_info)
    return [
        {
            "id": obj.id,
            "hash": obj.hash,
            "shapeInformations": obj.shape_info.to_dict() if obj.shape_info else None,
            "landNeighbours": obj.landNeighbours,
        }
        for obj in my_objects
    ]


def is_black_pixel(pixel: Tuple[int, int, int]) -> bool:
    return pixel[0] == 0 and pixel[1] == 0 and pixel[2] == 0


def is_white_pixel(pixel: Tuple[int, int, int]) -> bool:
    return pixel[0] == 255 and pixel[1] == 255 and pixel[2] == 255


def is_black_or_white_pixel(pixel: Tuple[int, int, int]) -> bool:
    return is_black_pixel(pixel) or is_white_pixel(pixel)


def remove_white_lines_from_color_map(map_colors: np.ndarray, remove_black: bool = True) -> np.ndarray:
    map_colors_copy = map_colors.copy()
    white_mask = (
        (map_colors[:, :, 0] == 255) &
        (map_colors[:, :, 1] == 255) &
        (map_colors[:, :, 2] == 255)
    )
    height, width = white_mask.shape

    for x in range(height):
        for y in range(width):
            if white_mask[x, y]:
                replacement_color = find_nearest_color(
                    map_colors, white_mask, x, y)
                map_colors_copy[x, y] = replacement_color

    if remove_black:
        black_mask = (
            (map_colors[:, :, 0] == 0) &
            (map_colors[:, :, 1] == 0) &
            (map_colors[:, :, 2] == 0)
        )

        for x in range(height):
            for y in range(width):
                if black_mask[x, y]:
                    replacement_color = find_nearest_color(
                        map_colors, black_mask, x, y)
                    map_colors_copy[x, y] = replacement_color

    return map_colors_copy


def find_nearest_color(map_colors: np.ndarray, mask: np.ndarray, x: int, y: int) -> tuple[int, int, int]:
    res = None

    distance = 1
    neighbors = [
        (x, y-distance),
        (x+distance, y),
        (x, y+distance),
        (x-distance, y),
    ]

    height, width = mask.shape

    while res is None:
        for nx, ny in neighbors:
            if 0 <= nx < height and 0 <= ny < width:
                if not mask[nx, ny]:
                    res = tuple(map_colors[nx, ny])
        distance += 1
        neighbors = [
            (x, y-distance),
            (x+distance, y),
            (x, y+distance),
            (x-distance, y),
        ]

    return res


def map_contours_to_grid(contours, cell_size=7):
    grid = {}

    for idx, contour in enumerate(contours):
        for point in contour:
            x, y = point[0]

            # Calculate the grid cell coordinates
            grid_x = x // cell_size
            grid_y = y // cell_size

            for i in [-1, 0, 1]:
                for j in [-1, 0, 1]:
                    cell_key = (grid_x + i, grid_y + j)
                    if cell_key not in grid:
                        grid[cell_key] = set()
                    grid[cell_key].add(idx)

    return grid


def find_adjacent_provinces(contours, display=False):
    last_province_idx = len(contours) - 1

    grid = map_contours_to_grid(contours)

    adjacency_list = {idx: set() for idx in range(last_province_idx)}

    for cell, contour_indices in grid.items():
        for idx in contour_indices:
            if idx != last_province_idx:
                # Add all the contours from this cell except for the current one and the last province
                to_add = contour_indices - {idx, last_province_idx}
                adjacency_list[idx].update(to_add)

    # Convert sets to lists and adjust for 1-based display
    for idx in adjacency_list:
        adjacency_list[idx] = sorted(
            [neighbor + 1 for neighbor in adjacency_list[idx]])
        if display:
            print("adjacency_list", idx + 1, adjacency_list[idx])

    return adjacency_list
