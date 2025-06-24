import json
import os
import random
from IPython.display import display
from PIL import Image
import cv2
import math
import random


def show(img):
    pil_image = Image.fromarray(img)
    display(pil_image)


def save_cv_image(path, file_name, img, code=cv2.COLOR_BGR2RGBA):
    cv2.imwrite(os.path.join(path, file_name),
                cv2.cvtColor(img, cv2.COLOR_BGR2RGBA))


def cube_root(number):
    return number ** (1 / 3)


def generate_test_color_stack(color_count):
    def calculate_step(color_count):
        root = math.ceil(cube_root(color_count))
        step = math.floor(255 / root)
        return step

    def generate_colors(step):
        colors = []
        for i in range(0, 256, step):
            for j in range(0, 256, step):
                for k in range(0, 256, step):
                    colors.append([i, j, k])
        return colors

    colors = generate_colors(calculate_step(color_count))
    random.shuffle(colors)
    stack = colors.copy()

    print("Generated", len(stack), "colors.")
    return stack


def write_json(data, output_dir, filename, pretty_print=True):
    if pretty_print:
        json_data = json.dumps(data, indent=2)
    else:
        json_data = json.dumps(data)
    jsonPath = os.path.join(output_dir, filename + ".json")
    with open(jsonPath, "w") as file:
        file.write(json_data)


def hex_to_rgb(hex_color: str) -> tuple[int, int, int]:
    return tuple(int(hex_color[i: i + 2], 16) for i in (0, 2, 4))
