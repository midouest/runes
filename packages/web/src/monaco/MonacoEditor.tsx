import * as monaco from "monaco-editor";
import { useEffect } from "react";
import styled from "styled-components";

import { useMonaco } from "./useMonaco";

const Container = styled.div`
  width: 512px;
  height: 256px;
`;

export type Editor = monaco.editor.IStandaloneCodeEditor;

export interface MonacoEditorProps {
  initialValue: string;
  onCreate?: (editor: Editor) => void;
  onContentChange?: (content: string, editor: Editor) => void;
  onPositionChange?: (
    event: monaco.editor.ICursorPositionChangedEvent,
    editor: Editor
  ) => void;
}

export function MonacoEditor({
  initialValue,
  onCreate,
  onContentChange,
  onPositionChange,
}: MonacoEditorProps): JSX.Element {
  const [editor, setEditorCallback] = useMonaco(initialValue);

  useEffect(() => {
    if (editor === null) {
      return;
    }

    onCreate && onCreate(editor);

    const disposables: monaco.IDisposable[] = [];

    if (onContentChange) {
      const disposable = editor.onDidChangeModelContent(() => {
        const value = editor.getValue();
        onContentChange(value, editor);
      });
      disposables.push(disposable);
    }

    if (onPositionChange) {
      const disposable = editor.onDidChangeCursorPosition((event) => {
        onPositionChange(event, editor);
      });
      disposables.push(disposable);
    }

    return () => {
      for (const disposable of disposables) {
        disposable.dispose();
      }
    };
  }, [editor]);

  return <Container ref={setEditorCallback}></Container>;
}
