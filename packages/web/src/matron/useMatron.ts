import { useContext } from "react";

import { Context } from "./Context";
import { MatronProcess } from "./MatronProcess";

export function useMatron(): MatronProcess | null {
  return useContext(Context);
}
