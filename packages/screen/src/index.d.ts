export interface WasmObject {
  delete();
}

export interface Screen {
  save();
  restore();
  font_face(i: number);
  font_size(z: number);
  aa(s: number);
  level(z: number);
  line_width(w: number);
  line_cap(style: string);
  line_join(style: string);
  miter_limit(limit: number);
  move(x: number, y: number);
  move_rel(x: number, y: number);
  line(x: number, y: number);
  line_rel(x: number, y: number);
  curve(x1: number, y1: number, x2: number, y2: number, x3: number, y3: number);
  curve_rel(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  );
  arc(x: number, y: number, r: number, a1: number, a2: number);
  rect(x: number, y: number, w: number, h: number);
  close_path();
  stroke();
  fill();
  text(s: string);
  clear();
  text_extents(s: string): Float64Array;
  rotate(r: number);
  translate(x: number, y: number);
  set_operator(i: number);
  get_data(): Uint8Array;
}

export type WasmScreen = Screen & WasmObject;

export interface WasmScreenConstructor {
  new (): WasmScreen;
}

export interface WasmInstance {
  Screen: WasmScreenConstructor;

  setValue(ptr: number, value: number, type: string): void;
  getValue(ptr: number, type: string): number;
  _malloc(size: number): number;
  _free(pointer: number): void;
}

declare var Module: () => Promise<WasmInstance>;

export default Module;
