import React, { MouseEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useScreenRef } from "../screen";
import { lineAngle, lineLength, Vec2d } from "../util/geometry";
import { Primitive } from "./primitives";
import { addPrimitive, startDrawing } from "./simpleDrawingSlice";
import { Tool } from "./tool";

export interface CanvasProps {
  isDrawing: boolean;
  tool: Tool;
  primitives: Primitive[];
}

function toLocal({
  nativeEvent: { offsetX, offsetY },
}: MouseEvent<HTMLCanvasElement>): Vec2d {
  return {
    x: Math.floor((128 * offsetX) / 512),
    y: Math.floor((64 * offsetY) / 256),
  };
}

export function Canvas({
  isDrawing,
  tool,
  primitives,
}: CanvasProps): JSX.Element {
  const prevIsDrawing = useRef<boolean | undefined>();
  const canvasRef = useRef<HTMLCanvasElement | undefined>();
  const screenRef = useScreenRef();
  const dispatch = useDispatch();
  const [points, setPoints] = useState<Vec2d[]>([]);

  useEffect(() => {
    if (prevIsDrawing.current === true && !isDrawing && points.length > 0) {
      setPoints([]);
    }
    prevIsDrawing.current = isDrawing;
  }, [prevIsDrawing, isDrawing]);

  useEffect(() => {
    const screen = screenRef.current;
    if (!screen) {
      return;
    }

    screen.clear();
    screen.aa(0);
    screen.level(15);
    screen.lineWidth(1);

    for (const primitive of primitives) {
      switch (primitive.type) {
        case "pixel": {
          const { x, y } = primitive;
          screen.pixel(x, y);
          screen.fill();
          break;
        }
        case "line": {
          const { x1, y1, x2, y2 } = primitive;
          screen.move(x1, y1);
          screen.line(x2, y2);
          screen.stroke();
          break;
        }
        case "rectangle": {
          const { x, y, w, h } = primitive;
          screen.rect(x, y, w, h);
          screen.stroke();
          break;
        }
        case "arc": {
          const { x, y, r, a1, a2 } = primitive;
          screen.arc(x, y, r, a1, a2);
          screen.stroke();
          break;
        }
        case "circle": {
          const { x, y, r } = primitive;
          screen.circle(x, y, r);
          screen.stroke();
          break;
        }
        case "curve": {
          const { x1, y1, x2, y2, x3, y3 } = primitive;
          screen.curve(x1, y1, x2, y2, x3, y3);
          screen.stroke();
          break;
        }
      }
    }

    screen.update(canvasRef.current.getContext("2d"));
  }, [screenRef, primitives]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = toLocal(event);
    switch (tool) {
      case "pixel": {
        dispatch(addPrimitive({ type: "pixel", x, y }));
        break;
      }

      case "line": {
        if (points.length === 0) {
          setPoints([{ x, y }]);
          dispatch(startDrawing());
        } else {
          const { x: x1, y: y1 } = points[0];
          dispatch(addPrimitive({ type: "line", x1, y1, x2: x, y2: y }));
        }
        break;
      }

      case "rectangle": {
        if (points.length === 0) {
          setPoints([{ x, y }]);
          dispatch(startDrawing());
        } else {
          const { x: x0, y: y0 } = points[0];
          const w = x - x0;
          const h = y - y0;

          dispatch(addPrimitive({ type: "rectangle", x: x0, y: y0, w, h }));
        }
        break;
      }
      case "arc": {
        if (points.length < 3) {
          if (points.length === 0) {
            dispatch(startDrawing());
          }
          setPoints([...points, { x, y }]);
        } else {
          const { x: x0, y: y0 } = points[0];
          const { x: xr, y: yr } = points[1];
          const { x: xa1, y: ya1 } = points[2];

          const r = lineLength(x0, y0, xr, yr);
          const a1 = lineAngle(x0, y0, xa1, ya1);
          const a2 = lineAngle(x0, y0, x, y);

          dispatch(addPrimitive({ type: "arc", x: x0, y: y0, r, a1, a2 }));
        }
        break;
      }
      case "circle": {
        if (points.length === 0) {
          setPoints([{ x, y }]);
          dispatch(startDrawing());
        } else {
          const { x: x0, y: y0 } = points[0];
          const r = lineLength(x0, y0, x, y);

          dispatch(addPrimitive({ type: "circle", x: x0, y: y0, r }));
        }
        break;
      }
      case "curve": {
        if (points.length < 2) {
          if (points.length === 0) {
            dispatch(startDrawing());
          }
          setPoints([...points, { x, y }]);
        } else {
          const { x: x1, y: y1 } = points[0];
          const { x: x2, y: y2 } = points[1];

          dispatch(
            addPrimitive({ type: "curve", x1, y1, x2, y2, x3: x, y3: y })
          );
        }
        break;
      }
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={128}
      height={64}
      onClick={handleCanvasClick}
    />
  );
}
