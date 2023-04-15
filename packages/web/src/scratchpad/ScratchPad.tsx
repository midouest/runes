import * as luaparse from "luaparse";
import * as monaco from "monaco-editor";
import { ChangeEvent, useCallback, useEffect, useRef } from "react";

import { SCREEN_HEIGHT, SCREEN_WIDTH, useMatron } from "../matron";
import { MonacoEditor } from "../monaco";

import { NornsEncoder } from "./NornsEncoder";
import { NornsKey } from "./NornsKey";
import { findSteppable } from "./findSteppable";
import {
  Column,
  Row,
  Spacer,
  MatronCanvas,
  Container,
} from "./ScratchPad.styles";
import { useCode } from "./useCode";
import { MonacoEditor as MonacoEditorInternal } from "../monaco/useMonaco";
import { initialCode } from "./initialCode";

export function ScratchPad(): JSX.Element {
  const matron = useMatron();
  const [code, setCode] = useCode(initialCode);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const editorRef = useRef<MonacoEditorInternal>(null);
  const shouldInitRef = useRef(true);

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

  const execute = (value: string) => {
    matron?.execute(value, shouldInitRef.current);
    shouldInitRef.current = false;
  };

  const init = () => {
    matron?.init();
  };

  const confirmResetEditor = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset the editor? All changes will be lost."
    );
    if (!confirmed) {
      return;
    }

    shouldInitRef.current = true;
    editorRef.current?.setValue(initialCode);
  };

  const updateCode = (value: string) => {
    execute(value);
    setCode(value);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => execute(code), []);

  const keyHandler = (n: number) => (isDown: boolean) => {
    matron?.key(n, isDown);
  };

  const handleEnc1 = useCallback(
    (delta: number) => {
      matron?.enc(1, delta);
    },
    [matron]
  );

  const handleEnc2 = useCallback(
    (delta: number) => {
      matron?.enc(2, delta);
    },
    [matron]
  );

  const handleEnc3 = useCallback(
    (delta: number) => {
      matron?.enc(3, delta);
    },
    [matron]
  );

  const handleAnimateChanged = (event: ChangeEvent) => {
    const enabled = (event.target as HTMLInputElement).checked;
    matron?.animate(enabled);
  };

  return (
    <Container>
      <Column style={{ maxWidth: "512px", minWidth: "512px" }}>
        <Row>
          <Spacer />
          <NornsKey keyId={1} onChange={keyHandler(1)} />
          <Spacer size={0.05} />
          <NornsEncoder encId={1} onChange={handleEnc1} />
        </Row>
        <MatronCanvas
          ref={canvasRef}
          width={SCREEN_WIDTH}
          height={SCREEN_HEIGHT}
        />
        <Row>
          <NornsKey keyId={2} onChange={keyHandler(2)} />
          <Spacer size={0.05} />
          <NornsKey keyId={3} onChange={keyHandler(3)} />
          <Spacer />
          <NornsEncoder encId={2} onChange={handleEnc2} />
          <Spacer size={0.05} />
          <NornsEncoder encId={3} onChange={handleEnc3} />
        </Row>
      </Column>
      <Column style={{ flex: 1, maxWidth: "512px", minWidth: "512px" }}>
        <Row>
          <div>
            <input
              id="animate"
              type="checkbox"
              onChange={handleAnimateChanged}
              title="Automatically re-render at 15fps"
            />
            <label htmlFor="animate" title="Automatically re-render at 15fps">
              Animate
            </label>
          </div>
          <Spacer />
          <button
            onClick={init}
            style={{ marginRight: "4px" }}
            title="Call the init function"
          >
            Init Script
          </button>
          <button
            onClick={confirmResetEditor}
            title="Restore the default script"
          >
            Reset Editor
          </button>
        </Row>
        <MonacoEditor
          ref={editorRef}
          initialValue={code}
          onCreate={handleCreate}
          onContentChange={updateCode}
          onPositionChange={handlePositionChange}
        />
      </Column>
    </Container>
  );
}
