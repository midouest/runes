import { createContext } from "react";

import { MatronWorker } from "./MatronWorker";

export const Context = createContext<MatronWorker | null>(null);
