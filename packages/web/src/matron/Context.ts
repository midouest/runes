import { createContext } from "react";
import { MatronProcess } from "./MatronProcess";

export const Context = createContext<MatronProcess | null>(null);
