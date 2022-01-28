import { useContext } from "react";
import { Context } from "./Context";
import { Matron } from "./Matron";

export function useMatron(): Matron | null {
  return useContext(Context);
}
