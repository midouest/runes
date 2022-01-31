import React, { useEffect, useRef, useState } from "react";
import { useMatron } from "../matron";
import styled from "styled-components";
import { MonacoEditor } from "../monaco";

const initialCode = `
function redraw()
  screen.clear()

  screen.move(64, 34)
  screen.level(15)
  screen.text_center("Welcome to Runes!")
  screen.stroke()

  screen.update()
end
`;

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export function ScratchPad(): JSX.Element {
  const matron = useMatron();
  const [code, setCode] = useState(initialCode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || matron === null) {
      return;
    }

    const offscreen = canvas.transferControlToOffscreen();
    matron.transferCanvas(offscreen);
  }, []);

  const execute = (value: string) => {
    matron?.execute(value);
    runesApi.eval(value);
  };

  const runCode = () => {
    execute(code);
  };

  const updateCode = (value: string) => {
    execute(value);
    setCode(value);
  };

  useEffect(() => runCode(), []);

  return (
    <FlexWrapper>
      <canvas ref={canvasRef} width={128} height={64} />
      <MonacoEditor initialValue={code} onChange={updateCode} />
      <button onClick={runCode}>Run</button>
    </FlexWrapper>
  );
}
