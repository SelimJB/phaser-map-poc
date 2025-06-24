from collections import namedtuple
import cv2


class Ellipse:
    def __init__(self, center=None, rectangle=None, angle=None, ellipse=None):
        if ellipse is not None:
            self.center = (int(ellipse[0][0]), int(ellipse[0][1]))
            self.rectangle = (int(ellipse[1][0]), int(ellipse[1][1]))
            self.angle = ellipse[2]
            self.ellipse = ellipse
        else:
            self.center = center
            self.rectangle = rectangle
            self.angle = angle
            self.ellipse = (
                self.center,
                self.rectangle,
                self.angle,
            )

    def __str__(self):
        return (
            f"Center: {self.center}, Rectangle: {self.rectangle}, Angle: {self.angle}"
        )

    def draw(self, image, color=(0, 255, 0), thickness=2):
        cv2.ellipse(
            image,
            self.ellipse,
            color,
            thickness=thickness,
        )

    def to_dict(self):
        return {
            "center": {"x": self.center[0], "y": self.center[1]},
            "rectangle": {"x": self.rectangle[0], "y": self.rectangle[1]},
            "angle": self.angle,
        }

    @classmethod
    def from_dict(cls, data):
        return cls(
            center=(data["center"]["x"], data["center"]["y"]),
            rectangle=(data["rectangle"]["x"], data["rectangle"]["y"]),
            angle=data["angle"],
        )


class Circle:
    def __init__(self, center: tuple, radius: int):
        self.center = (int(center[0]), int(center[1]))
        self.radius = int(radius)

    def __str__(self):
        return f"Center: {self.center}, Radius: {self.radius}"

    def draw(self, image, color=(0, 255, 0), thickness=2):
        if self.radius > 0:
            cv2.circle(image, self.center, self.radius,
                       color, thickness=thickness)
        else:
            print(f"Invalid radius: {self.radius}")
            cv2.circle(image, self.center, 2, (0, 100, 255), thickness=15)

    def to_dict(self):
        return {
            "center": {"x": self.center[0], "y": self.center[1]},
            "radius": self.radius,
        }

    @classmethod
    def from_dict(cls, data):
        center = (data["center"]["x"], data["center"]["y"])
        return cls(center=center, radius=data["radius"])


ShapeInformation = namedtuple(
    "ShapeInformation", ["centroid", "ellipse", "enclosed_circle"]
)


class ProvinceShapeInformation:
    def __init__(
        self,
        center: tuple,
        ellipse: Ellipse,
        enclosed_circle: Circle,
    ):
        self.center = center
        self.ellipse = ellipse
        self.enclosed_circle = enclosed_circle

    def __str__(self):
        return f"Center: {self.center}, Ellipse: {self.ellipse}, Enclosed Circle: {self.enclosed_circle}"

    def to_dict(self):
        return {
            "center": {"x": self.center[0], "y": self.center[1]},
            # "ellipse": self.ellipse.to_dict(),
            "enclosedCircle": self.enclosed_circle.to_dict(),
        }

    @classmethod
    def from_dict(cls, data):
        if data is None:
            return None
        return cls(
            center=(data["center"]["x"], data["center"]["y"]),
            ellipse=Ellipse.from_dict(data["ellipse"])
            if data.get("ellipse")
            else Ellipse(),
            enclosed_circle=Circle.from_dict(data["enclosedCircle"]),
        )
