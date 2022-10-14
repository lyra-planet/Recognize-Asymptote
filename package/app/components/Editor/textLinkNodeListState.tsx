import {
  textLinkNode,
  textLinkNodeRow,
  textNodeLinkList2,
  textNodeRowLinkListVDomToDom,
} from "./textLinkNodeListDomState";

import { v4 as uuid } from "uuid";
import type { T_ControllState } from ".";
interface I_Selection {
  end: number;
  start: number;
  startNodeDom: Node | null;
  endNodeDom: Node | null;
}

let textsState: Array<textLinkNode> = [
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-h1"],
    state: "new",
    content: "我他妈写不来1",
    rowId: "",
  },
  {
    label: "br",
    type: "br",
    id: "linknode-" + uuid(),
    marks: [],
    state: "new",
    content: "",
    rowId: "",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-h2"],
    state: "new",
    content: "我他妈写不来2",
    rowId: "",
  },
  {
    label: "br",
    type: "br",
    id: "linknode-" + uuid(),
    marks: [],
    state: "new",
    content: "",
    rowId: "",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-h3"],
    state: "new",
    content: "我他妈写不来3",
    rowId: "",
  },
  {
    label: "br",
    type: "br",
    id: "linknode-" + uuid(),
    marks: [],
    state: "new",
    content: "",
    rowId: "",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-text"],
    state: "new",
    content: "我他妈写不来4",
    rowId: "",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-text"],
    state: "new",
    content: "我他妈写不来5",
    rowId: "",
  },
];
let textsRowState: Array<textLinkNodeRow> = [];
export const changeTextState = (
  selection: I_Selection,
  controllState: T_ControllState,
  ...args: any[]
) => {
  const { end, start, startNodeDom, endNodeDom } = selection;
  if (!startNodeDom || !endNodeDom) {
    return;
  }
  //获取虚拟Dom
  //@ts-ignore
  let startNodeId = startNodeDom?.id;
  //@ts-ignore
  let endNodeId = endNodeDom?.id;
  const row = [startNodeId, endNodeId];
  const findNodes = textsState.filter((node) => row.indexOf(node.id) !== -1);
  if (!findNodes) {
    return;
  }
  const startNodeIndex = textsState.indexOf(findNodes[0] as textLinkNode);
  const endNodeIndex = textsState.indexOf(
    findNodes[findNodes.length - 1] as textLinkNode
  );
  const selectedNodes = [];
  for (let i = startNodeIndex; i <= endNodeIndex; i++) {
    textsState[i].state = "delete";
    selectedNodes.push(textsState[i]);
  }
  let mountElement = document.querySelector(".editor-content");
  if (mountElement === null) {
    return;
  }
  const startNode = { ...findNodes[0] };
  const endNode = { ...findNodes[findNodes.length - 1] };
  let afterStart = start,
    afterEnd = end;
  if (
    startNode.id !== startNodeId ||
    (startNode.id === endNode.id && start > end)
  ) {
    afterEnd = start;
    afterStart = end;
  }
  const startNodeContent = startNode.content.slice(0, afterStart);
  const endNodeContent = endNode.content.slice(
    afterEnd,
    findNodes[findNodes.length - 1].content.length
  );
  startNode.content = startNodeContent;
  endNode.content = endNodeContent;
  startNode.state = "change";
  endNode.state = "new";
  endNode.id = "linknode-" + uuid();
  if (controllState === "insert") {
    let newNode = {
      label: "p",
      type: "textNode",
      id: "linknode-" + uuid(),
      marks: ["editor-text", "text-purple-600"],
      state: "new",
      content: "我插进来了欧",
      rowId: "",
    } as textLinkNode;
    //替换选中的字符
    textsState.splice(startNodeIndex, 1, startNode, newNode, endNode);
  } else {
    if (args.length !== 0) {
      switch (args[0].length) {
        case 1:
          //键入单个字符
          enterSingleCharacter(
            selectedNodes,
            startNode,
            endNode,
            textsState,
            startNodeIndex,
            args
          );
          break;
        default:
          enterSpecailCharacter(
            afterStart,
            afterEnd,
            selectedNodes,
            startNode,
            endNode,
            textsState,
            startNodeIndex,
            args
          );
          break;
      }
    }
  }
  let beforRow: textLinkNodeRow | undefined = undefined;
  let rowNode: textLinkNodeRow | undefined = undefined;
  let searchRowId = "";
  const copyTextsState = [...textsState];
  copyTextsState.forEach((text) => {
    switch (text.state) {
      case "new":
        if (!beforRow) {
          return;
        }
        if (text.label === "br") {
          searchRowId = beforRow.rowId;
          const index = textsRowState.indexOf(beforRow);
          const newRow: textLinkNodeRow = {
            children: [],
            rowId: "linknoderow-" + uuid(),
            state: "new",
          };
          text.rowId = newRow.rowId;
          newRow.children.push(text);
          textsRowState.splice(index + 1, 0, newRow);
          beforRow = newRow;
        } else {
          if (searchRowId === text.rowId) {
            rowNode = textsRowState.find((el) => el.rowId === text.rowId);
            rowNode?.children.filter(
              (el) => el.id === text.id
            ) as textLinkNode[];
            text.state = "new";
            text.rowId = beforRow.rowId;
            beforRow.children.push(text);
          } else {
            text.rowId = beforRow.rowId;
            beforRow.children.push(text);
          }
        }
        break;
      case "change":
        rowNode = textsRowState.find((el) => el.rowId === text.rowId);
        if (!rowNode) {
          return;
        }
          rowNode.state = "change";
          text.state = "change";
          let textNode = rowNode.children.find(
            (el) => el.id === text.id
          ) as textLinkNode;
          rowNode.children[rowNode.children.indexOf(textNode)] = text;
          beforRow = rowNode;
        break;
      case "delete":
        
        rowNode = textsRowState.find((el) => el.rowId === text.rowId);
        
        if (!rowNode) {
          return;
        }
        
        if (startNode.rowId === endNode.rowId) {
          const deleteTextNode = rowNode.children.filter(
            (el) => el.id === text.id
          ) as textLinkNode[];    
          deleteTextNode[0].state = "delete";
          rowNode.state = "change";
        } else {
          if (startNode.rowId === text.rowId || endNode.rowId === text.rowId) {
            const deleteTextNode = rowNode.children.filter(
              (el) => el.id === text.id
            ) as textLinkNode[];
            if(endNode.rowId===text.rowId){
            rowNode.state='delete'
            }else{
              deleteTextNode[0].state = "delete";
              rowNode.state = "change";
              searchRowId = endNode.rowId
            }
          } else {
            rowNode.state = "delete";
          }
        }
        break;
      case "static":
        rowNode = textsRowState.find((el) => el.rowId === text.rowId);
        if (!rowNode) {
          return;
        }
        if (searchRowId === text.rowId && beforRow) {
          const moveTextNode = rowNode.children.filter(
            (el) => el.id === text.id
          ) as textLinkNode[];
          moveTextNode[0].state = "delete";
          text.rowId = beforRow.rowId;
          const newText = { ...text };
          newText.state = "new";
          beforRow?.children.push(newText);
          rowNode.state = "change";
        } else {
          beforRow = rowNode;
        }
        break;
      default:
        console.log("Error");
        return;
    }
  });

  textNodeRowLinkListVDomToDom(textsRowState);

  textsState = textsState.filter((textLinkNode) => {
    if (textLinkNode.state !== "delete") {
      textLinkNode.state = "static";
      return textLinkNode;
    }
  }) as textLinkNode[];
  const newTextsRowState = textsRowState.map((textsRow)=>{
    if(textsRow.state!=="delete"){
      const newChildren = textsRow.children.filter((text)=>{
        if (text.state !== "delete") {
          text.state = "static";
          return text
        }
      })
      textsRow.state = "static";
      textsRow = {  children:newChildren,
        rowId:textsRow.rowId,
        state:textsRow.state}
      return textsRow
    }
  })
  textsRowState = newTextsRowState.filter(el=>el!==undefined) as textLinkNodeRow[]
};

const enterSingleCharacter = (
  selectedNodes: any[],
  startNode: textLinkNode,
  endNode: textLinkNode,
  textsState: Array<textLinkNode>,
  startNodeIndex: number,
  args: any[]
) => {
  if (selectedNodes.length == 1) {
    startNode.content += args[0];
    startNode.content += endNode.content;
    textsState.splice(startNodeIndex, 1, startNode);
  } else if (selectedNodes.length > 1) {
    startNode.content += args[0];
    startNode.content += endNode.content;
    textsState.splice(startNodeIndex, 1, startNode);
  }
};
const enterSpecailCharacter = (
  afterStart: number,
  afterEnd: number,
  selectedNodes: any[],
  startNode: textLinkNode,
  endNode: textLinkNode,
  textsState: Array<textLinkNode>,
  startNodeIndex: number,
  args: any[]
) => {
  switch (args[0]) {
    case "Enter":
      enterTextState(startNode, endNode, textsState, startNodeIndex);
      break;
    case "Backspace":
      backspaceTextState(
        afterStart,
        afterEnd,
        selectedNodes,
        startNode,
        endNode,
        textsState,
        startNodeIndex
      );
      break;
    default:
      break;
  }
};

const enterTextState = (
  startNode: textLinkNode,
  endNode: textLinkNode,
  textsState: Array<textLinkNode>,
  startNodeIndex: number
) => {
  let newNode = {
    label: "br",
    type: "br",
    id: "linknode-" + uuid(),
    marks: [],
    state: "new",
    content: "",
    rowId: "",
  } as textLinkNode;
  if (endNode.content.length !== 0) {
    textsState.splice(startNodeIndex, 1, startNode, newNode, endNode);
  } else {
    textsState.splice(startNodeIndex, 1, startNode, newNode);
  }
};
const backspaceTextState = (
  afterStart: number,
  afterEnd: number,
  selectedNodes: any[],
  startNode: textLinkNode,
  endNode: textLinkNode,
  textsState: Array<textLinkNode>,
  startNodeIndex: number
) => {
  if (selectedNodes.length == 1) {
    let startNodeContent = "";
    if (afterStart !== afterEnd) {
      startNodeContent = startNode.content.slice(0, afterStart);
    } else {
      startNodeContent = startNode.content.slice(0, afterStart - 1);
    }
    startNode.content = startNodeContent + endNode.content;
    textsState.splice(startNodeIndex, 1, startNode);
  } else if (selectedNodes.length > 1) {
    if (endNode.content.length !== 0) {
      textsState.splice(startNodeIndex, 1, startNode, endNode);
    } else {
      textsState.splice(startNodeIndex, 1, startNode);
    }
  }
};
export const initTextLinkNodeRow = (textsState: Array<textLinkNode>) => {
  let nowTextNodeRow: textLinkNodeRow | null = null;
  textsState.forEach((textLinkNode, index) => {
    if (index === 0 || textLinkNode.label === "br") {
      if (index !== 0) {
        textsRowState.push(nowTextNodeRow as textLinkNodeRow);
      }
      nowTextNodeRow = {
        children: [],
        rowId: "linknoderow-" + uuid(),
        state: "new",
      };
    }
    if (!nowTextNodeRow) {
      return;
    }
    const node = { ...textLinkNode, rowId: nowTextNodeRow.rowId };
    textsState[index].rowId = nowTextNodeRow.rowId;
    textsState[index].state = "static";
    nowTextNodeRow.children.push(node);
  });
  if (!nowTextNodeRow) {
    return;
  }
  textsRowState.push(nowTextNodeRow as textLinkNodeRow);
};

export const initTextState = () => {
  const contentDom = document.querySelector(".content");
  let mountElement = document.createElement("div");
  mountElement.classList.add("editor-content");
  contentDom?.appendChild(mountElement);
  if (mountElement) {
    initTextLinkNodeRow(textsState);
    textNodeLinkList2(textsRowState);
  }
};
