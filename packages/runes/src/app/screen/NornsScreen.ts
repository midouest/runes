import Module, { WasmInstance } from "@runes/screen";
import { toRadians } from "../util/math";

const BLEND_MODES: Record<string, number> = {
  NONE: 0,
  DEFAULT: 0,
  OVER: 0,
  XOR: 1,
  ADD: 2,
  MULTIPLY: 3,
  SCREEN: 4,
  OVERLAY: 5,
  DARKEN: 6,
  LIGHTEN: 7,
  COLOR_DODGE: 8,
  COLOR_BURN: 9,
  HARD_LIGHT: 10,
  SOFT_LIGHT: 11,
  DIFFERENCE: 12,
  EXCLUSION: 13,
  CLEAR: 14,
  SOURCE: 15,
  IN: 16,
  OUT: 17,
  ATOP: 18,
  DEST: 19,
  DEST_OVER: 20,
  DEST_IN: 21,
  DEST_OUT: 22,
  DEST_ATOP: 23,
  SATURATE: 24,
  HSL_HUE: 25,
  HSL_SATURATION: 26,
  HSL_COLOR: 27,
  HSL_LUMINOSITY: 28,
};

export class NornsScreen {
  static async load(): Promise<NornsScreen> {
    const instance = await Module();
    return new NornsScreen(instance);
  }

  private _screen = new this._instance.Screen();

  constructor(private _instance: WasmInstance) {}

  update(context: CanvasRenderingContext2D) {
    const data = this._screen.get_data();
    const dataCopy = new Uint8ClampedArray(
      data.buffer,
      data.byteOffset,
      data.byteLength
    );
    const imageData = new ImageData(dataCopy, 128, 64);
    context.putImageData(imageData, 0, 0);
  }

  save() {
    this._screen.save();
  }

  restore() {
    this._screen.restore();
  }

  fontFace(i: number) {
    this._screen.font_face(i);
  }

  fontSize(z: number) {
    this._screen.font_size(z);
  }

  aa(s: number) {
    this._screen.aa(s);
  }

  level(z: number) {
    this._screen.level(z);
  }

  lineWidth(w: number) {
    this._screen.line_width(w);
  }

  lineCap(style: "butt" | "round" | "square") {
    this._screen.line_cap(style);
  }

  lineJoin(style: "miter" | "round" | "bevel") {
    this._screen.line_join(style);
  }

  miterLimit(limit: number) {
    this._screen.miter_limit(limit);
  }

  move(x: number, y: number) {
    this._screen.move(x, y);
  }

  moveRel(x: number, y: number) {
    this._screen.move_rel(x, y);
  }

  line(x: number, y: number) {
    this._screen.line(x, y);
  }

  lineRel(x: number, y: number) {
    this._screen.line_rel(x, y);
  }

  curve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ) {
    this._screen.curve(x1, y1, x2, y2, x3, y3);
  }

  curveRel(
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number,
    dx3: number,
    dy3: number
  ) {
    this._screen.curve_rel(dx1, dy1, dx2, dy2, dx3, dy3);
  }

  arc(x: number, y: number, r: number, a1: number, a2: number) {
    this._screen.arc(x, y, r, a1, a2);
  }

  circle(x: number, y: number, r: number) {
    this._screen.arc(x, y, r, 0, Math.PI * 2);
  }

  rect(x: number, y: number, w: number, h: number) {
    this._screen.rect(x, y, w, h);
  }

  closePath() {
    this._screen.close_path();
  }

  stroke() {
    this._screen.stroke();
  }

  fill() {
    this._screen.fill();
  }

  text(s: string) {
    this._screen.text(s);
  }

  textRotate(x: number, y: number, s: string, degrees: number) {
    this._screen.save();
    this._screen.move(x, y);
    this._screen.translate(x, y);
    const radians = toRadians(degrees);
    this._screen.rotate(radians);
    this._screen.text(s);
    this._screen.restore();
  }

  textRight(s: string) {
    const extents = this._screen.text_extents(s);
    const x = extents[0];
    this._screen.move_rel(-x, 0);
    this._screen.text(s);
  }

  textCenter(s: string) {
    const extents = this._screen.text_extents(s);
    const x = extents[0];
    this._screen.move_rel(-x / 2, 0);
    this._screen.text(s);
  }

  textCenterRotate(x: number, y: number, s: string, degrees: number) {
    this._screen.save();
    this._screen.move(x, y);
    this._screen.translate(x, y);
    const radians = degrees * (Math.PI / 180);
    this._screen.rotate(radians);
    const extents = this._screen.text_extents(s);
    const x2 = extents[0];
    this._screen.move_rel(-x2 / 2, 0);
    this._screen.text(s);
    this._screen.restore();
  }

  clear() {
    this._screen.clear();
  }

  textExtents(s: string): Float64Array {
    return this._screen.text_extents(s);
  }

  rotate(r: number) {
    this._screen.rotate(r);
  }

  translate(x: number, y: number) {
    this._screen.translate(x, y);
  }

  pixel(x: number, y: number) {
    this._screen.rect(x, y, 1, 1);
  }

  blendMode(index: string | number) {
    if (typeof index === "string") {
      const i = BLEND_MODES[index.toUpperCase()];
      if (i !== undefined) {
        this._screen.set_operator(i);
      }
    } else {
      this._screen.set_operator(index);
    }
  }

  delete() {
    this._screen.delete();
  }
}
