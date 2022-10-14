import { v4 as uuid } from "uuid";
export type T_State = "new" | "change" | "delete" | "static";
export type textLinkNode = {
  label: string;
  type: string;
  id: string;
  content: string;
  state: T_State;
  marks: Array<string>;
  rowId: string;
}
export type T_RowState = "new" | "change" | "delete" | "static";
export type textLinkNodeRow = {
  children:Array<textLinkNode>;
  rowId: string;
  state:T_RowState;
}
export type textLinkNodeList = Array<textLinkNode>;
interface textLinkNodeListFunc {
  (textLinkNodeList: textLinkNodeList): void;
}
//初始化Dom链表
export const textNodeLinkList: textLinkNodeListFunc = (textLinkNodeList) => {
  let mountElement = document.querySelector(".content>div") as Element;
  textLinkNodeList.map((textLinkNode,index) => {
    const element = createLinkNodeDom(textLinkNode);
    textLinkNode.state = "static";
    mountElement.appendChild(element);
  });
};
interface textLinkNodeListFunc2 {
  (textLinkNodeRowList: Array<textLinkNodeRow>): void;
}
export const textNodeLinkList2: textLinkNodeListFunc2 = (textLinkNodeRowList) => {
  let mountElement = document.querySelector(".editor-content") as Element;
  textLinkNodeRowList.forEach((textLinkNodeRow) => {
    const rowElement:Element = createLinkNodeRowDom(textLinkNodeRow)
    mountElement.appendChild(rowElement);
    textLinkNodeRow.children.forEach((textLinkNode)=>{
      const element = createLinkNodeDom(textLinkNode)
      rowElement.appendChild(element)
      textLinkNode.state = "static"
    })
    textLinkNodeRow.state = "static" 
  });
};
interface textNodeLinkListChangeFunc {
  (textLinkNodeRow: textLinkNodeRow): void;
}
export const textNodeLinkListVDomToDom: textNodeLinkListChangeFunc = (
  textLinkNodeRow
) => {
  let beforeElement: HTMLElement | null = null;
  textLinkNodeRow.children.map((textLinkNode, index) => {
    switch (textLinkNode.state) {
      case "new":
        beforeElement = new_generateTextNodeDom(
          index,
          textLinkNode,
          textLinkNodeRow.rowId,
          beforeElement as HTMLElement
        );
        return true;
      case "change":
        beforeElement = change_generateTextNodeDom(
          textLinkNode,
          textLinkNodeRow.rowId,
        );
        return true;
      case "delete":
        delete_generateTextNodeDom(textLinkNode,textLinkNodeRow.rowId,);
        return true;
      case "static":
        beforeElement = static_generateTextNodeDom(textLinkNode);
        return true;
      default:
        return false;
    }
  });
};

interface textNodeRowLinkListChangeFunc {
  (textLinkNodeRowList: Array<textLinkNodeRow>): void;
}
export const textNodeRowLinkListVDomToDom: textNodeRowLinkListChangeFunc = (
  textLinkNodeRowList
) => {
  let beforeElement: HTMLElement | null = null;
  textLinkNodeRowList.map((textLinkNodeRow, index) => {
    switch (textLinkNodeRow.state) {
      case "new":
        beforeElement = new_generateTextNodeRowDom(
          index,
          textLinkNodeRow,
          beforeElement as HTMLElement
        );
        return true;
      case "change":
        beforeElement = change_generateTextNodeRowDom(
          textLinkNodeRow
        );
        return true;
      case "delete":
        delete_generateTextNodeRowDom(textLinkNodeRow);
        return true;
      case "static":
        beforeElement = static_generateTextNodeRowDom(
          textLinkNodeRow
        );
        return true;
      default:
        return false;
    }
  });
};
//------------------------------------------
interface I_new_generateTextNodeRowDom {
  (
    index: number,
    textLinkNodeRow: textLinkNodeRow,
    beforeElement: HTMLElement
  ): HTMLElement;
}
export const new_generateTextNodeRowDom: I_new_generateTextNodeRowDom = (
  index,
  textLinkNodeRow,
  beforeElement
) => {
  let mountElement = document.querySelector(".editor-content") as Element;
  const element = createLinkNodeRowDom(textLinkNodeRow);
  if (index === 0) {
    insertBeforeRow(element, mountElement.firstElementChild as Element);
  }
  if (index > 0) {
    insertAfterRow(element, beforeElement); 
  }
  textNodeLinkListVDomToDom(textLinkNodeRow)
  textLinkNodeRow.state = "static";
  return document.getElementById(textLinkNodeRow.rowId) as HTMLElement;
};
interface I_change_generateTextNodeRowDom {
  ( textLinkNodeRow: textLinkNodeRow): HTMLElement;
}
export const change_generateTextNodeRowDom: I_change_generateTextNodeRowDom = (
  textLinkNodeRow
) => {
  textNodeLinkListVDomToDom(textLinkNodeRow)
  textLinkNodeRow.state = "static";
  return document.getElementById(textLinkNodeRow.rowId) as HTMLElement;
};
interface I_static_generateTextNodeRowDom {
  (textLinkNodeRow: textLinkNodeRow): HTMLElement;
}
export const static_generateTextNodeRowDom: I_static_generateTextNodeRowDom = (
  textLinkNodeRow,
) => {
  return document.getElementById(textLinkNodeRow.rowId) as HTMLElement;
};
interface I_delete_generateTextNodeRowDom {
  (textLinkNodeRow: textLinkNodeRow): void;
}
export const delete_generateTextNodeRowDom: I_delete_generateTextNodeRowDom = (
  textLinkNodeRow
) => {
  let mountElement = document.querySelector(".editor-content") as Element;
  const element = document.getElementById(textLinkNodeRow.rowId);
  mountElement.removeChild(element as HTMLElement);
};
//-------------------------------------------

//------------------------------------------
interface I_new_generateTextNodeDom {
  (
    index: number,
    textLinkNode: textLinkNode,
    mountRowElementId:string,
    beforeElement: HTMLElement
  ): HTMLElement;
}
export const new_generateTextNodeDom: I_new_generateTextNodeDom = (
  index,
  textLinkNode,
  mountRowElementId,
  beforeElement
) => {
  let mountElement = document.querySelector(`#${mountRowElementId}`) as Element;
  const element = createLinkNodeDom(textLinkNode);

  if (index === 0) {
    insertBefore(element, mountElement.firstElementChild as Element,mountRowElementId);
    textLinkNode.state = "static";
  }
  if (index > 0) {
    insertAfter(element, beforeElement,mountRowElementId);
    textLinkNode.state = "static";
  }
  return document.getElementById(textLinkNode.id) as HTMLElement;
};
interface I_change_generateTextNodeDom {
  (textLinkNode: textLinkNode,mountRowElementId:string): HTMLElement;
}
export const change_generateTextNodeDom: I_change_generateTextNodeDom = (
  textLinkNode, 
  mountRowElementId,
) => {
  const element = createLinkNodeDom(textLinkNode);
  const beforeChangeElement = document.getElementById(textLinkNode.id);
  beforeChangeElement?.replaceWith(element)
  textLinkNode.state = "static";
  return document.getElementById(textLinkNode.id) as HTMLElement;
};
interface I_static_generateTextNodeDom {
  (textLinkNode: textLinkNode): HTMLElement;
}
export const static_generateTextNodeDom: I_static_generateTextNodeDom = (
  textLinkNode,
) => {
  const beforeChangeElement = document.getElementById(
    textLinkNode.id
  ) as HTMLElement;
  return beforeChangeElement as HTMLElement;
};
interface I_delete_generateTextNodeDom {
  (textLinkNode: textLinkNode, mountRowElementId:string): void;
}
export const delete_generateTextNodeDom: I_delete_generateTextNodeDom = (
  textLinkNode,
  mountRowElementId
) => {
  let mountElement = document.querySelector(`#${mountRowElementId}`) as Element;
  const element = document.getElementById(textLinkNode.id);
  mountElement.removeChild(element as HTMLElement);
};
//-------------------------------------------
interface I_createLinkNodeDomFunc {
  (LinkNode: textLinkNode): HTMLElement;
}
//根据虚拟Dom创建真实Dom
export const createLinkNodeDom: I_createLinkNodeDomFunc = (LinkNode) => {
  const element = document.createElement(LinkNode.label);
  element.id = LinkNode.id;
  element.classList.add(LinkNode.type);
  element.setAttribute("type", LinkNode.type);
  element.setAttribute("rowId",LinkNode.rowId);
  if (LinkNode.marks.length != 0) {
    element.classList.add(...LinkNode.marks);
  }
  element.innerText = LinkNode.content;
  return element;
};
interface I_createLinkNodeRowDomFunc {
  (LinkNodeRow: textLinkNodeRow): HTMLElement;
}
export const createLinkNodeRowDom: I_createLinkNodeRowDomFunc = (LinkNodeRow) => {
    const element = document.createElement('div');
    element.id = LinkNodeRow.rowId;
    element.classList.add("editor-row");
    return element;
};
//------------------------------------------
interface I_insertAfterRow {
  (newElement: HTMLElement, targetElement: Element): void;
}
//在targetElement之后插入 新节点newElement
export const insertAfterRow: I_insertAfterRow = (newElement, targetElement) => {
  let mountElement = document.querySelector(".editor-content") as Element;
  if (!mountElement) {
    return;
  }
  if (mountElement.lastChild == targetElement) {
    mountElement.appendChild(newElement);
  } else {
    console.log()
    mountElement.insertBefore(newElement, targetElement.nextSibling);
  }
};
interface I_insertBeforeRow {
  (newElement: HTMLElement, targetElement: Element): void;
}
export const insertBeforeRow: I_insertBeforeRow = (newElement, targetElement) => {
  let mountElement = document.querySelector(".editor-content") as Element;
  if (!mountElement) {
    return;
  }
  if (!targetElement) {
    mountElement.appendChild(newElement);
  } else {
    mountElement.insertBefore(newElement, targetElement);
  }
};
//------------------------------------------
interface I_insertAfter {
  (newElement: HTMLElement, targetElement: Element,mountRowElementId:string): void;
}
export const insertAfter: I_insertAfter = (newElement, targetElement,mountRowElementId) => {
  let mountElement = document.querySelector(`#${mountRowElementId}`) as Element;
  if (!mountElement) {
    return;
  }
  if (mountElement.lastChild == targetElement) {
    mountElement.appendChild(newElement);
  } else {
    mountElement.insertBefore(newElement, targetElement.nextSibling);
  }
};
interface I_insertBefore {
  (newElement: HTMLElement, targetElement: Element,mountRowElementId:string): void;
}
export const insertBefore: I_insertBefore = (newElement, targetElement,mountRowElementId) => {
  let mountElement = document.querySelector(`#${mountRowElementId}`) as Element;
  if (!mountElement) {
    return;
  }
  if (!targetElement) {
    mountElement.appendChild(newElement);
  } else {
    mountElement.insertBefore(newElement, targetElement);
  }
};
//------------------------------------------