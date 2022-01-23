import React from "react";
import { useSelector } from "react-redux";
import { Canvas } from "./Canvas";
import { selectIsDrawing, selectPrimitives, selectTool } from "./selectors";
import { Toolbar } from "./Toolbar";

export function SimpleDrawingApp() {
  const isDrawing = useSelector(selectIsDrawing);
  const tool = useSelector(selectTool);
  const primitives = useSelector(selectPrimitives);

  return (
    <>
      <Toolbar />
      <Canvas isDrawing={isDrawing} tool={tool} primitives={primitives} />
    </>
  );
}
