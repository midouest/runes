import { useState } from "react";

const runesCodeKey = "runesCode";

export function useCode(initialCode: string): [string, (code: string) => void] {
  const prevCode = localStorage.getItem(runesCodeKey) || initialCode;
  const [code, setCode] = useState(prevCode);

  const saveCode = (code: string): void => {
    localStorage.setItem(runesCodeKey, code);
    setCode(code);
  };

  return [code, saveCode];
}
