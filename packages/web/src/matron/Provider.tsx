import React, { ReactNode } from "react";

import { Context } from "./Context";
import { MatronProcess } from "./MatronProcess";

export interface ProviderProps {
  matron: MatronProcess | null;
  children: ReactNode;
}

export function Provider({ matron, children }: ProviderProps): JSX.Element {
  return <Context.Provider value={matron}>{children}</Context.Provider>;
}
