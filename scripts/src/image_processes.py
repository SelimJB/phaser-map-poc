import numpy as np
import cv2
from skimage.morphology import medial_axis
from skimage.util import invert
from IPython.display import display
from PIL import Image
import utils
from shapes import Circle, Ellipse, ProvinceShapeInformation
from typing import List, Tuple


def convert_image_to_grayscale(img: np.ndarray, display: bool = False, size: Tuple[int, int] = None) -> np.ndarray:
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    if size is not None:
        gray_image = cv2.resize(gray_image, size)
    if display:
        show(gray_image)
    return gray_image


def calculate_centroid(contour: np.ndarray) -> Tuple[int, int]:
    contour_points = contour[:, 0, :]
    M = cv2.moments(contour)
    if M["m00"] != 0:
        center_x = int(M["m10"] / M["m00"])
        center_y = int(M["m01"] / M["m00"])
    else:
        center_x = int(sum(contour_points[:, 0]) / len(contour_points))
        center_y = int(sum(contour_points[:, 1]) / len(contour_points))
    return (center_x, center_y)


def calculate_biggest_enclosed_circle(contour: np.ndarray, step_size: int = 10) -> Circle:
    centroid = calculate_centroid(contour)

    centroid_radius = cv2.pointPolygonTest(contour, centroid, True)

    max_radius = centroid_radius
    center = centroid

    for x in range(contour[:, 0, 0].min(), contour[:, 0, 0].max() + 1, step_size):
        for y in range(contour[:, 0, 1].min(), contour[:, 0, 1].max() + 1, step_size):
            radius = cv2.pointPolygonTest(contour, (x, y), True)
            if radius > 0:
                if radius > max_radius:
                    max_radius = radius
                    center = (x, y)

    return Circle(center, max_radius)


def extract_refined_contour_info(
    gray_img: np.ndarray,
    gray_threshold: int,
    retrieval_mode: int = cv2.RETR_TREE,
    contour_approximation: int = cv2.CHAIN_APPROX_SIMPLE,
    is_blur: bool = False,
    enable_small_provinces_post_process: bool = False,
    enable_duplicate_island_provinces_post_process: bool = False,
    min_contour_area: int = 50,
    treshold_contour_distance: int = 4,
    verbose: bool = False,
) -> Tuple[
    List[np.ndarray],
    List[Tuple[int, int]],
    List[ProvinceShapeInformation],
    List[np.ndarray],
    List[np.ndarray],
]:
    # Pre-process: Apply Gaussian blur if isBlur is True
    if is_blur:
        gray_img = cv2.GaussianBlur(gray_img, (5, 5), 0)

    _, thresh = cv2.threshold(gray_img, gray_threshold, 255, cv2.THRESH_BINARY)
    contours, _ = cv2.findContours(
        thresh, retrieval_mode, contour_approximation)
    print("Number of contours found:", len(contours))

    # Post-process: Filter out small contours if isPostProcess is True
    if enable_small_provinces_post_process:
        contours = [c for c in contours if cv2.contourArea(
            c) > min_contour_area]

    contour_center_list = []
    for i, contour in enumerate(contours):
        center = calculate_centroid(contour)
        contour_center_list.append({"contour": contour, "center": center})

    # Post-process P2: Filter out contours that are too close from each other
    duplicated_contours = []
    if enable_duplicate_island_provinces_post_process:
        contours_to_remove = []
        for i in range(len(contour_center_list)):
            for j in range(i + 1, len(contour_center_list)):
                center1 = contour_center_list[i]["center"]
                center2 = contour_center_list[j]["center"]
                distance = np.linalg.norm(
                    np.array(center1) - np.array(center2))
                if distance < treshold_contour_distance:
                    if verbose:
                        print(distance)
                    contours_to_remove.append(i)
                    duplicated_contours.append(
                        [
                            contour_center_list[i]["contour"][0][0],
                            contour_center_list[j]["contour"][0][0],
                            center1,
                        ]
                    )

        contour_center_list = [
            contour_center
            for i, contour_center in enumerate(contour_center_list)
            if i not in contours_to_remove
        ]
        print(
            "Number of contours after duplicated island provinces removal post-processing:",
            len(contour_center_list),
        )

    # Calculate additional information using the contours
    points = []
    center_points = []
    contours = []
    shape_informations: List[ProvinceShapeInformation] = []

    for contour_center in contour_center_list:
        points.append(contour_center["contour"][0])
        contours.append(contour_center["contour"])
        center = contour_center["center"]
        center_points.append(center)

        # Calculate ellipse and enclosed circle
        if len(contour_center["contour"]) >= 5:
            fit_ellipse = cv2.fitEllipse(contour_center["contour"])
            ellipse = Ellipse(ellipse=fit_ellipse)
        else:
            ellipse = Ellipse()
        enclosed_circle = calculate_biggest_enclosed_circle(
            contour_center["contour"], 10
        )

        shape_information = ProvinceShapeInformation(
            center,
            ellipse,
            enclosed_circle,
        )
        shape_informations.append(shape_information)

    return contours, points, shape_informations, duplicated_contours


def draw_contours(skeleton_image: np.ndarray, contours: List[np.ndarray], display: bool = False):
    skeleton_uint8 = (skeleton_image * 255).astype(np.uint8)
    filled_image = cv2.cvtColor(skeleton_uint8, cv2.COLOR_GRAY2BGR)
    color_stack = utils.generate_test_color_stack(len(contours))
    for i, contour in enumerate(contours):
        color = tuple(color_stack.pop())
        cv2.drawContours(filled_image, contours, i, color, -1)
    if display:
        show(filled_image)
    return filled_image


def fill_contours(
    skeleton_image: np.ndarray,
    contours_image: np.ndarray,
    points: List[Tuple[int, int]],
    display: bool = False,
    shape_informations: List[ProvinceShapeInformation] = [],
    use_shape_informations=False,
):
    skeleton_uint8 = (skeleton_image * 255).astype(np.uint8)
    copy = cv2.cvtColor(invert(skeleton_uint8), cv2.COLOR_GRAY2BGR)
    if len(points) != len(shape_informations):
        print("Error: points and shape_informations must have the same length")
    for i, point in enumerate(points):
        if use_shape_informations and len(shape_informations) > 0:
            x, y = shape_informations[i].enclosed_circle.center
        else:
            x, y = point
        x, y = shape_informations[i].enclosed_circle.center
        color = tuple(contours_image[y, x])
        color = (int(color[0]), int(color[1]), int(color[2]))
        cv2.floodFill(copy, None, (x, y), color)
    if display:
        show(copy)
    return copy


def hex_to_rgba(hex_color: str) -> Tuple[float, float, float, float]:
    if hex_color.startswith("#"):
        hex_color = hex_color[1:]
    if len(hex_color) == 6:
        r, g, b = (
            int(hex_color[:2], 16),
            int(hex_color[2:4], 16),
            int(hex_color[4:6], 16),
        )
        return [r / 255.0, g / 255.0, b / 255.0, 1.0]


def show(img: np.ndarray):
    pilImage = Image.fromarray(img)
    display(pilImage)


def create_blank_image(width: int, height: int, color: Tuple[int, int, int, int] = (255, 255, 255, 255)) -> np.ndarray:
    blank_image = np.zeros((height, width, 4), np.uint8)
    blank_image[:, :] = color
    return blank_image


def dilatation(img: np.ndarray, kernelSize: int, display: bool = False) -> np.ndarray:
    kernel = np.ones((kernelSize, kernelSize), np.uint8)
    img_dilated = cv2.dilate(img, kernel, iterations=1)
    if display:
        show(img_dilated)
    return img_dilated


def blur(img: np.ndarray, kernelSize: int, display: bool = False) -> np.ndarray:
    kernel = np.ones((kernelSize, kernelSize), np.float32) / (kernelSize**2)
    img_blurred = cv2.filter2D(img, -1, kernel)
    if display:
        show(img_blurred)
    return img_blurred


def to_rgba(img: np.ndarray) -> np.ndarray:
    color_channel = cv2.cvtColor(img, cv2.COLOR_GRAY2RGB)
    color_channel[color_channel > 0] = 255
    alpha_channel = img.copy()
    alpha_channel = alpha_channel.astype(img.dtype)
    black_pixels_mask = cv2.inRange(img, 0, 20)
    alpha_channel[black_pixels_mask == 255] = 0
    res = cv2.merge((color_channel, alpha_channel))
    return res


def normalize_blurred_image(img: np.ndarray, percentilTreshold: int, display: bool = False) -> np.ndarray:
    # Filter out black pixels
    non_black_pixels = img[img > 0]
    # mean_color = np.mean(non_black_pixels)
    threshold = np.percentile(non_black_pixels, percentilTreshold)
    # Each pixel above this threshold are white
    normalized_pixels = np.where(
        non_black_pixels > threshold, 255, non_black_pixels / threshold * 255
    )
    img_normalized = img.copy()
    img_normalized[img_normalized > 0] = normalized_pixels.astype(np.uint8)
    blur_rgba = to_rgba(img_normalized)
    if display:
        print("Threshold:", threshold)
        show(blur_rgba)
    return blur_rgba


def thickening(
    skeleton: np.ndarray,
    dilatation_kernel_size: int,
    blur_kernel_size: int,
    normalization_percentil_threshol: int,
    color: Tuple[int, int, int, int] = (1, 1, 1, 1),
    display: bool = False,
    display_intermediate_steps: bool = False,
) -> np.ndarray:
    skeleton_uint8 = (skeleton * 255).astype(np.uint8)
    dilatationImg = dilatation(
        skeleton_uint8, dilatation_kernel_size, display_intermediate_steps
    )
    blurImg = blur(dilatationImg, blur_kernel_size, display_intermediate_steps)
    norm = normalize_blurred_image(
        blurImg, normalization_percentil_threshol, display_intermediate_steps
    )
    colored_norm = norm * color
    colored_norm = colored_norm.astype(np.uint8)
    if display:
        show(colored_norm)
    return colored_norm
