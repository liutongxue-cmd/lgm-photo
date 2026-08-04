import { createContext, useContext } from "react";
import type { Work } from "@/types/work";

export interface ViewerOpen {
  list: Work[];
  index: number;
  x: number;
  y: number;
}

export const ViewerCtx = createContext<(o: ViewerOpen) => void>(() => {});
export const useViewer = () => useContext(ViewerCtx);
