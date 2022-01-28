import React, { useEffect, useRef, useState } from "react";
import { useMatron } from "../matron";
import { useAnimation } from "../util/useAnimation";
import styled from "styled-components";
import { MonacoEditor } from "../monaco";
import { parse } from "luaparse";

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

  const runCode = () => {
    try {
      parse(code);
      matron?.exec(redraw(code));
      runesApi.eval(code);
    } catch (err) {
      // noop
    }
  };

  const updateCode = (value: string) => {
    try {
      parse(value);
      matron?.exec(redraw(value));
      runesApi.eval(value);
      setCode(value);
    } catch (err) {
      // noop
    }
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
