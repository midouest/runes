export interface Pixel {
  type: "pixel";
  x: number;
  y: number;
}

export interface Line {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Rectangle {
  type: "rectangle";
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Arc {
  type: "arc";
  x: number;
  y: number;
  r: number;
  a1: number;
  a2: number;
}

export interface Circle {
  type: "circle";
  x: number;
  y: number;
  r: number;
}

export interface Curve {
  type: "curve";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  x3: number;
  y3: number;
}

export interface Text {
  type: "text";
  x: number;
  y: number;
  text: string;
}

export type Primitive = Pixel | Line | Rectangle | Arc | Circle | Curve | Text;
