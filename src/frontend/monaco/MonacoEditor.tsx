import React, { useEffect } from "react";
import { useMonaco } from "./useMonaco";
import styled from "styled-components";
import * as monaco from "monaco-editor";

const Container = styled.div`
  width: 512px;
  height: 256px;
`;

export interface MonacoEditorProps {
  initialValue: string;
  onCreate?: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  onContentChange?: (content: string) => void;
  onPositionChange?: (event: monaco.editor.ICursorPositionChangedEvent) => void;
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
        onContentChange(value);
      });
      disposables.push(disposable);
    }

    if (onPositionChange) {
      const disposable = editor.onDidChangeCursorPosition((event) => {
        onPositionChange(event);
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
