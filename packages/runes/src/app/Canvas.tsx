import React, { useRef } from "react";

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | undefined>();
  return <canvas ref={canvasRef} width={128} height={64} />;
}
