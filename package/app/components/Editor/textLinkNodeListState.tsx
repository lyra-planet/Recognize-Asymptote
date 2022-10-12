import type { textLinkNode } from "./textLinkNodeListDomState";
import {
  textNodeLinkList,
  textNodeLinkListVDomToDom,
  T_State,
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
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-h2"],
    state: "new",
    content: "我他妈写不来2",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-h3"],
    state: "new",
    content: "我他妈写不来3",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-text"],
    state: "new",
    content: "我他妈写不来4",
  },
  {
    label: "p",
    type: "textNode",
    id: "textnode-" + uuid(),
    marks: ["editor-text"],
    state: "new",
    content: "我他妈写不来5",
  },
];

export const changeTextState = (
  selection: I_Selection,
  controllState: T_ControllState,
  ...args: any[]
) => {
  console.log(controllState);
  const { end, start, startNodeDom, endNodeDom } = selection;
  if (!startNodeDom || !endNodeDom) {
    return;
  }
  //获取虚拟Dom
  //@ts-ignore
  const startNodeId = startNodeDom?.parentNode?.id;
  //@ts-ignore
  const endNodeId = endNodeDom?.parentNode?.id;
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
  let mountElement = document.querySelector(".content>div");
  if (mountElement === null) {
    return;
  }
  const startNode = { ...findNodes[0] };
  const endNode = { ...findNodes[findNodes.length - 1] };
  const startNodeContent = startNode.content.slice(0, start);
  const endNodeContent = endNode.content.slice(
    end,
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

  //
  textNodeLinkListVDomToDom(textsState);

  //
  textsState = textsState.filter(
    (textLinkNode) => textLinkNode.state === "static"
  );
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
  selectedNodes: any[],
  startNode: textLinkNode,
  endNode: textLinkNode,
  textsState: Array<textLinkNode>,
  startNodeIndex: number,
  args: any[]
) => {
  switch (args[0]) {
    case "Enter":
      let newNode = {
        label: "br",
        type: "br",
        id: "linknode-" + uuid(),
        marks: [],
        state: "new",
        content: "",
      } as textLinkNode;
      if (endNode.content.length !== 0) {
        textsState.splice(startNodeIndex, 1, startNode, newNode, endNode);
      } else {
        textsState.splice(startNodeIndex, 1, startNode, newNode);
      }
      break;
    case "Backspace":
      break;
    default:
      break;
  }
};
export const initTextState = () => {
  console.log("Create");
  const contentDom = document.querySelector(".content");
  let mountElement = document.createElement("div");
  mountElement.classList.add("editor-content");
  contentDom?.appendChild(mountElement);
  if (mountElement) {
    textNodeLinkList(textsState);
  }
};
