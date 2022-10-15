import { useEffect, useState, useRef, MutableRefObject } from "react";
import { changeTextState, initTextState } from "./textLinkNodeListState";
import { getCursor, resetCursor } from "../../hook/getCursor";
import { editorController } from './editorController';
export type selection = {
  end: number;
  start: number;
  startNodeDom: Element | null;
  endNodeDom: Element | null;
}

export type T_ControllState = "type" | "insert" | "change" | "delete";

const EditorController = () => {
  const [controllState, setControllState] = useState<T_ControllState>("type");
  let selection = useRef<selection>({
    end: 0,
    start: 0,
    startNodeDom: null,
    endNodeDom: null,
  });
  useEffect(() => {
    initTextState();
    editorController()
  }, []);
  return <div className="content" />;
};

export default EditorController;
