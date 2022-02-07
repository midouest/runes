import { useContext } from "react";

import { Context } from "./Context";
import { MatronWorker } from "./MatronWorker";

export function useMatron(): MatronWorker | null {
  return useContext(Context);
}
