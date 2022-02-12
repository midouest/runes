import * as monaco from "monaco-editor";
import { useCallback, useState } from "react";

export type MonacoEditor = monaco.editor.IStandaloneCodeEditor | null;

export function useMonaco(
  initialValue: string
): [MonacoEditor, (element: HTMLElement | null) => void] {
  const [editor, setEditor] = useState<MonacoEditor>(null);

  const setEditorCallback = useCallback((element: HTMLElement | null) => {
    if (element === null) {
      return;
    }

    const editor = monaco.editor.create(element, {
      value: initialValue,
      language: "lua",
    });
    setEditor(editor);
  }, []);

  return [editor, setEditorCallback];
}
