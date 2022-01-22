import React from "react";
import { Canvas } from "./Canvas";
import { Toolbar } from "./Toolbar";

export function App(): JSX.Element {
  return (
    <>
      <Toolbar />
      <Canvas />
    </>
  );
}
