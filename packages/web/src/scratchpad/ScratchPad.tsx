import * as luaparse from "luaparse";
import * as monaco from "monaco-editor";
import { useEffect, useRef, useState } from "react";

import { SCREEN_HEIGHT, SCREEN_WIDTH, useMatron } from "../matron";
import { MonacoEditor } from "../monaco";

import { NornsEncoder } from "./NornsEncoder";
import { NornsKey } from "./NornsKey";
import { findSteppable } from "./findSteppable";
import { initialCode } from "./initialCode";
import { Column, Row, Spacer, MatronCanvas } from "./ScratchPad.styles";

export function ScratchPad(): JSX.Element {
  const matron = useMatron();
  const [code, setCode] = useState(initialCode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas === null || matron === null) {
      return;
    }

    matron.setCanvas(canvas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextKeyRef = useRef<monaco.editor.IContextKey<
    luaparse.NumericLiteral | luaparse.UnaryExpression | null
  > | null>(null);

  const handleCreate = (editor: monaco.editor.IStandaloneCodeEditor) => {
    contextKeyRef.current = editor.createContextKey("isNumberSelected", null);

    editor.addAction({
      id: "incrementSelectedNumber",
      label: "Increment Selected Number",
      keybindings: [
        monaco.KeyMod.Alt | monaco.KeyMod.CtrlCmd | monaco.KeyCode.Equal,
      ],
      precondition: "isNumberSelected",
      run: (editor) => stepNumber(editor, 1),
    });

    editor.addAction({
      id: "incrementSelectedNumberMore",
      label: "Increment Selected Number More",
      keybindings: [
        monaco.KeyMod.Shift |
          monaco.KeyMod.Alt |
          monaco.KeyMod.CtrlCmd |
          monaco.KeyCode.Equal,
      ],
      precondition: "isNumberSelected",
      run: (editor) => stepNumber(editor, 10),
    });

    editor.addAction({
      id: "decrementSelectedNumber",
      label: "Decrement Selected Number",
      keybindings: [
        monaco.KeyMod.Alt | monaco.KeyMod.CtrlCmd | monaco.KeyCode.Minus,
      ],
      precondition: "isNumberSelected",
      run: (editor) => stepNumber(editor, -1),
    });

    editor.addAction({
      id: "decrementSelectedNumberMore",
      label: "Decrement Selected Number More",
      keybindings: [
        monaco.KeyMod.Shift |
          monaco.KeyMod.Alt |
          monaco.KeyMod.CtrlCmd |
          monaco.KeyCode.Minus,
      ],
      precondition: "isNumberSelected",
      run: (editor) => stepNumber(editor, -10),
    });
  };

  const stepNumber = (editor: monaco.editor.ICodeEditor, amount: number) => {
    const contextKey = contextKeyRef.current;
    if (!contextKey) {
      throw new Error("Expected context key ref to be current");
    }

    const node = contextKey.get();
    if (!node?.loc) {
      throw new Error("Expected context key node to be set with location");
    }

    const content = editor.getValue();
    const lines = content.split("\n");
    const lineNumber = node.loc.start.line - 1;
    const headLines = lines.slice(0, lineNumber);
    const line = lines[lineNumber];
    const start = node.loc.start.column;
    const end = node.loc.end.column;
    const head = line.slice(0, start);
    const tail = line.slice(end);
    const tailLines = lines.slice(lineNumber + 1);

    let value;
    if (node.type === "UnaryExpression") {
      if (node.operator !== "-" || node.argument.type !== "NumericLiteral") {
        throw new Error("Attempted to step unsupported unary expression");
      }
      value = -node.argument.value;
    } else {
      if (node.type !== "NumericLiteral") {
        throw new Error("Attempted to step unsupported node");
      }
      value = node.value;
    }

    const newValue = value + amount;
    const newLine = `${head}${newValue}${tail}`;
    const newLines = [...headLines, newLine, ...tailLines];
    const newCode = newLines.join("\n");

    setCode(newCode);
    editor.getModel()?.setValue(newCode);
    editor.setPosition({
      lineNumber: lineNumber + 1,
      column: start + 1,
    });
  };

  const handlePositionChange = (
    event: monaco.editor.ICursorPositionChangedEvent,
    editor: monaco.editor.IStandaloneCodeEditor
  ) => {
    const contextKey = contextKeyRef.current;
    if (contextKey === null) {
      return;
    }

    const content = editor.getValue();
    try {
      const ast = luaparse.parse(content, { locations: true });
      const { lineNumber, column } = event.position;
      const node = findSteppable(ast, lineNumber, column);
      contextKey.set(node);
    } catch (err) {
      contextKey.set(null);
    }
  };

  const execute = (value: string, shouldInit?: boolean) => {
    matron?.execute(value, shouldInit);
  };

  const init = () => {
    matron?.init();
  };

  const updateCode = (value: string) => {
    execute(value);
    setCode(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => execute(code, true), []);

  const keyHandler = (n: number) => (isDown: boolean) => {
    matron?.key(n, isDown);
  };

  const encHandler = (n: number) => (delta: number) => {
    matron?.enc(n, delta);
  };

  return (
    <Column>
      <Row>
        <Spacer />
        <NornsKey onChange={keyHandler(1)} />
        <Spacer size={0.05} />
        <NornsEncoder onChange={encHandler(1)} />
      </Row>
      <MatronCanvas
        ref={canvasRef}
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT}
      />
      <Row>
        <NornsKey onChange={keyHandler(2)} />
        <Spacer size={0.05} />
        <NornsKey onChange={keyHandler(3)} />
        <Spacer />
        <NornsEncoder onChange={encHandler(2)} />
        <Spacer size={0.05} />
        <NornsEncoder onChange={encHandler(3)} />
      </Row>
      <MonacoEditor
        initialValue={code}
        onCreate={handleCreate}
        onContentChange={updateCode}
        onPositionChange={handlePositionChange}
      />
      <button onClick={init}>Init</button>
    </Column>
  );
}
