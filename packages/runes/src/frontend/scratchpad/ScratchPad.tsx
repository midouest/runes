import React, { ChangeEvent, useRef, useState } from "react";
import { useMatron } from "../matron";
import { useAnimation } from "../util/useAnimation";
import styled from "styled-components";

const initialCode = `
function redraw()
  screen.clear()

  screen.update()
end
`;

function redraw(code: string): string {
  return `${code}
screen.save()
redraw()
screen.restore()`;
}

const FlexWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

export function ScratchPad(): JSX.Element {
  const matron = useMatron();
  const [code, setCode] = useState(initialCode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useAnimation((dt: number) => {
    const context = canvasRef.current?.getContext("2d");
    if (!(context && matron?.isDirty())) {
      return;
    }

    const screen = matron.getScreen();
    const data = new ImageData(screen, 128, 64);
    context.putImageData(data, 0, 0);
  });

  const updateCode = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    setCode(value);
  };

  const runCode = () => {
    matron?.exec(redraw(code));
  };

  return (
    <FlexWrapper>
      <canvas ref={canvasRef} width={128} height={64} />
      <textarea onChange={updateCode} value={code} />
      <button onClick={runCode}>Run</button>
    </FlexWrapper>
  );
}
