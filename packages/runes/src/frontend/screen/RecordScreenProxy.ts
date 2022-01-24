import { BaseScreen, LineCapStyle, LineJoinStyle } from "./interface";

export class RecordScreenProxy implements BaseScreen {
  private _commands: string[] = [];

  constructor(private _screen: BaseScreen) {}

  toRenderFunction(): string {
    const body = this._commands.join(";");
    const render = `function redraw() ${body} end`;
    this._commands = [];
    return render;
  }

  update(context: CanvasRenderingContext2D): void {
    this._commands.push("screen.update()");
    this._screen.update(context);
  }

  save(): void {
    this._commands.push("screen.save()");
    this._screen.save();
  }

  restore(): void {
    this._commands.push("screen.restore()");
    this._screen.restore();
  }

  fontFace(i: number): void {
    this._commands.push(`screen.font_face(${i})`);
    this._screen.fontFace(i);
  }

  fontSize(z: number): void {
    this._commands.push(`screen.font_size(${z})`);
    this._screen.fontSize(z);
  }

  aa(s: number): void {
    this._commands.push(`screen.aa(${s})`);
    this._screen.aa(s);
  }

  level(z: number): void {
    this._commands.push(`screen.level(${z})`);
    this._screen.level(z);
  }

  lineWidth(w: number): void {
    this._commands.push(`screen.line_width(${w})`);
    this._screen.lineWidth(w);
  }

  lineCap(style: LineCapStyle): void {
    this._commands.push(`screen.line_cap("${style}")`);
    this._screen.lineCap(style);
  }

  lineJoin(style: LineJoinStyle): void {
    this._commands.push(`screen.line_join("${style}")`);
    this._screen.lineJoin(style);
  }

  miterLimit(limit: number): void {
    this._commands.push(`screen.miter_limit(${limit})`);
    this._screen.miterLimit(limit);
  }

  move(x: number, y: number): void {
    this._commands.push(`screen.move(${x},${y})`);
    this._screen.move(x, y);
  }

  moveRel(x: number, y: number): void {
    this._commands.push(`screen.move_rel(${x},${y})`);
    this._screen.moveRel(x, y);
  }

  line(x: number, y: number): void {
    this._commands.push(`screen.line(${x},${y})`);
    this._screen.line(x, y);
  }

  lineRel(x: number, y: number): void {
    this._commands.push(`screen.line_rel(${x},${y})`);
    this._screen.lineRel(x, y);
  }

  curve(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): void {
    this._commands.push(`screen.curve(${x1},${y1},${x2},${y2},${x3},${y3})`);
    this._screen.curve(x1, y1, x2, y2, x3, y3);
  }

  curveRel(
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number,
    dx3: number,
    dy3: number
  ): void {
    this._commands.push(
      `screen.curve_rel(${dx1},${dy1},${dx2},${dy2},${dx3},${dy3})`
    );
    this._screen.curve(dx1, dy1, dx2, dy2, dx3, dy3);
  }

  arc(x: number, y: number, r: number, a1: number, a2: number): void {
    this._commands.push(`screen.arc(${x},${y},${r},${a1},${a2})`);
    this._screen.arc(x, y, r, a1, a2);
  }

  circle(x: number, y: number, r: number): void {
    this._commands.push(`screen.circle(${x},${y},${r})`);
    this._screen.circle(x, y, r);
  }

  rect(x: number, y: number, w: number, h: number): void {
    this._commands.push(`screen.rect(${x},${y},${w},${h})`);
    this._screen.rect(x, y, w, h);
  }

  closePath(): void {
    this._commands.push(`screen.close_path()`);
    this._screen.closePath();
  }

  stroke(): void {
    this._commands.push(`screen.stroke()`);
    this._screen.stroke();
  }

  fill(): void {
    this._commands.push(`screen.fill()`);
    this._screen.fill();
  }

  text(s: string): void {
    this._commands.push(`screen.text("${s}")`);
    this._screen.text(s);
  }

  textRotate(x: number, y: number, s: string, degrees: number): void {
    this._commands.push(`screen.text_rotate(${x},${y},"${s}",${degrees})`);
    this._screen.textRotate(x, y, s, degrees);
  }

  textRight(s: string): void {
    this._commands.push(`screen.text_right("${s}")`);
    this._screen.textRight(s);
  }

  textCenter(s: string): void {
    this._commands.push(`screen.text_center("${s}")`);
    this._screen.textCenter(s);
  }

  textCenterRotate(x: number, y: number, s: string, degrees: number): void {
    this._commands.push(
      `screen.text_center_rotate(${x},${y},"${s}",${degrees})`
    );
    this._screen.textCenterRotate(x, y, s, degrees);
  }

  clear(): void {
    this._commands.push("screen.clear()");
    this._screen.clear();
  }

  textExtents(s: string): Float64Array {
    // this._commands.push("screen.text_extents()");
    return this._screen.textExtents(s);
  }

  rotate(r: number): void {
    this._commands.push(`screen.rotate(${r})`);
    this._screen.rotate(r);
  }

  translate(x: number, y: number): void {
    this._commands.push(`screen.translate(${x},${y})`);
    this._screen.translate(x, y);
  }

  pixel(x: number, y: number): void {
    this._commands.push(`screen.pixel(${x},${y})`);
    this._screen.pixel(x, y);
  }

  blendMode(index: string | number): void {
    if (typeof index === "string") {
      this._commands.push(`screen.blend_mode("${index}")`);
    } else {
      this._commands.push(`screen.blend_mode(${index})`);
    }
    this._screen.blendMode(index);
  }
}
