import * as monaco from "monaco-editor";
import { Ref, forwardRef, useEffect, useImperativeHandle } from "react";
import styled from "styled-components";

import { useMonaco, MonacoEditor as MonacoEditorInternal } from "./useMonaco";

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

function MonacoEditorWithRef(
  {
    initialValue,
    onCreate,
    onContentChange,
    onPositionChange,
  }: MonacoEditorProps,
  ref: Ref<MonacoEditorInternal>
): JSX.Element {
  const [editor, setEditorCallback] = useMonaco(initialValue);

  useImperativeHandle(ref, () => editor, [editor]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  return <Container ref={setEditorCallback}></Container>;
}

export const MonacoEditor = forwardRef(MonacoEditorWithRef);
