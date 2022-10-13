import { useEffect, useState, useRef } from "react";
import { changeTextState, initTextState } from "./textLinkNodeListState";
import { getCursor, resetCursor, } from "../../hook/getCursor";
interface selection {
  end: number;
  start: number;
  startNodeDom: Node | null;
  endNodeDom: Node | null;
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
    document.addEventListener("selectionchange", (e) => {});
    document.addEventListener("mouseup", () => {
      selection.current = getCursor() as selection;

      if (controllState === "insert" || controllState === "change") {
        changeTextState(selection.current, controllState);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (controllState === "type") {
        console.log(selection.current);
        changeTextState(selection.current, controllState, e.key);
        switch (e.key.length) {
          case 1:
            selection.current = {
              ...selection.current,
              start: selection.current.start + 1,
              end: selection.current.start + 1,
            };
            break;
          default:
            switch(e.key){
              case "Enter":
                if (selection.current.startNodeDom?.parentElement) {
                  const nextDom = document.querySelector(
                    `#${selection.current.startNodeDom.parentElement.id}`
                  )?.nextElementSibling?.nextElementSibling as Element;
                  selection.current = {
                    startNodeDom: nextDom.childNodes[0],
                    endNodeDom: nextDom.childNodes[0],
                    start: 0,
                    end: 0,
                  };
                }
                break
                case "Backspace":
                  break
            }

        }
      }
      resetCursor()
    });
  }, []);

  return <div className="content" />;
};

export default EditorController;
