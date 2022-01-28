import React, { ReactNode } from "react";
import { Context } from "./Context";
import { Matron } from "./Matron";

export interface ProviderProps {
  matron: Matron | null;
  children: ReactNode;
}

export function Provider({ matron, children }: ProviderProps): JSX.Element {
  return <Context.Provider value={matron}>{children}</Context.Provider>;
}
