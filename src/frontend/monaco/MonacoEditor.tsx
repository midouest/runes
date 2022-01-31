import React, { useEffect } from "react";
import { useMonaco } from "./useMonaco";
import styled from "styled-components";

const Container = styled.div`
  width: 512px;
  height: 256px;
`;

export interface MonacoEditorProps {
  initialValue: string;
  onChange: (code: string) => void;
}

export function MonacoEditor({
  initialValue,
  onChange,
}: MonacoEditorProps): JSX.Element {
  const [editor, setEditorCallback] = useMonaco(initialValue);

  useEffect(() => {
    if (editor === null) {
      return;
    }

    const disposable = editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      onChange(value);
    });

    return () => {
      disposable.dispose();
    };
  }, [editor]);

  return <Container ref={setEditorCallback}></Container>;
}
