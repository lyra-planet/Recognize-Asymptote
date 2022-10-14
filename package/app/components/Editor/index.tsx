import { useEffect, useState, useRef } from "react";
import { changeTextState, initTextState } from "./textLinkNodeListState";
import { getCursor, resetCursor } from "../../hook/getCursor";
interface selection {
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
    document.addEventListener("selectionchange", (e) => {});
    document.addEventListener("mouseup", () => {
      selection.current = getCursor() as selection;
      if (controllState === "insert" || controllState === "change") {
        changeTextState(selection.current, controllState);
      }
    });
    document.addEventListener("keyup", (e) => {
      if (controllState === "type") {
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
            switch (e.key) {
              case "Enter":
                if (!selection.current.startNodeDom) {
                  return;
                }
                const currentRowDom = document.querySelector(
                  `#${selection.current.startNodeDom.attributes[3].value}`
                );
                if (currentRowDom) {
                  if (currentRowDom.nextElementSibling) {
                    selection.current = {
                      startNodeDom:
                        currentRowDom.nextElementSibling.children[1],
                      endNodeDom: currentRowDom.nextElementSibling.children[1],
                      start: 0,
                      end: 0,
                    };
                  }
                }
                break;
              case "Backspace":
                selection.current = {
                  ...selection.current,
                  start: selection.current.start - 1,
                  end: selection.current.start - 1,
                };
                if (!selection.current.startNodeDom) {
                  return;
                }
                if (selection.current.start <= 0) {
                  const currentDom = document.querySelector(
                    `#${selection.current.startNodeDom.id}`
                  );
                  const previousDom = currentDom?.previousElementSibling;
                  if (!previousDom) {
                    return;
                  }
                  if (
                    previousDom?.tagName !== "P" &&
                    selection.current.start < 0
                  ) {
                    const currentRowDom = document.querySelector(
                      `#${selection.current.startNodeDom.attributes[3].value}`
                    );
                    if (currentRowDom) {
                      if (currentRowDom.previousElementSibling) {
                        const lastChildDom =
                          currentRowDom.previousElementSibling.lastElementChild;
                        if (!lastChildDom?.textContent) {
                          return;
                        }
                        selection.current = {
                          startNodeDom: lastChildDom,
                          endNodeDom: lastChildDom,
                          start: lastChildDom?.textContent?.length,
                          end: lastChildDom?.textContent?.length,
                        };
                      }
                    }
                  } else {
                    if (!previousDom.textContent?.length) {
                      return;
                    }
                    selection.current = {
                      startNodeDom: previousDom,
                      endNodeDom: previousDom,
                      start: previousDom.textContent?.length,
                      end: previousDom.textContent?.length,
                    };
                  }
                }
                break;
            }
        }
      }
      resetCursor();
    });
  }, []);

  return <div className="content" />;
};

export default EditorController;
