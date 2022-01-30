import React, { ReactNode } from "react";
import { Context } from "./Context";
import { MatronWorker } from "./MatronWorker";

export interface ProviderProps {
  matron: MatronWorker | null;
  children: ReactNode;
}

export function Provider({ matron, children }: ProviderProps): JSX.Element {
  return <Context.Provider value={matron}>{children}</Context.Provider>;
}
