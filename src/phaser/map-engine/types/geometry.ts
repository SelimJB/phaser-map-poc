export type Point = { x: number; y: number };
export type Segment = [Point, Point];
export type Line = { slope: number; yIntercept: number };

export interface Ellipse {
  center: Point;
  rectangle: Point;
  angle: number;
}

export interface Circle {
  center: Point;
  radius: number;
}

export interface ShapeInformations {
  center: Point;
  enclosedCircle: Circle;
}

export interface Size {
  width: number;
  height: number;
}
