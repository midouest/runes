import { createContext } from "react";
import { Matron } from "./Matron";

export const Context = createContext<Matron | null>(null);
