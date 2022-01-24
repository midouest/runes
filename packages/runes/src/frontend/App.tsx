import React from "react";
import { SimpleDrawingApp } from "./simple-drawing";

export function App(): JSX.Element {
  const handleConnect = () => runesApi.connect("norns.local", 5555);

  return (
    <div>
      <SimpleDrawingApp />
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}
