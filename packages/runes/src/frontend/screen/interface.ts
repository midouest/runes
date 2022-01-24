export type LineCapStyle = "butt" | "round" | "square";
export type LineJoinStyle = "miter" | "round" | "bevel";

export interface BaseScreen {
  update(context: CanvasRenderingContext2D): void;
  save(): void;
  restore(): void;
  fontFace(i: number): void;
  fontSize(z: number): void;
  aa(s: number): void;
  level(z: number): void;
  lineWidth(w: number): void;
  lineCap(style: LineCapStyle): void;
  lineJoin(style: LineJoinStyle): void;
  miterLimit(limit: number): void;
  move(x: number, y: number): void;
  moveRel(x: number, y: number): void;
  line(x: number, y: number): void;
  lineRel(x: number, y: number): void;
  curve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void;
  curveRel(
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number,
    dx3: number,
    dy3: number
  ): void;
  arc(x: number, y: number, r: number, a1: number, a2: number): void;
  circle(x: number, y: number, r: number): void;
  rect(x: number, y: number, w: number, h: number): void;
  closePath(): void;
  stroke(): void;
  fill(): void;
  text(s: string): void;
  textRotate(x: number, y: number, s: string, degrees: number): void;
  textRight(s: string): void;
  textCenter(s: string): void;
  textCenterRotate(x: number, y: number, s: string, degrees: number): void;
  clear(): void;
  textExtents(s: string): Float64Array;
  rotate(r: number): void;
  translate(x: number, y: number): void;
  pixel(x: number, y: number): void;
  blendMode(index: string | number): void;
}
