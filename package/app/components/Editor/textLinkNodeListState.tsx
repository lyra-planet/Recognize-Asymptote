import { textLinkNode, textNodeLinkList, textNodeLinkListChange, textNodeLinkListRerender2 } from './textLinkNodeListDomState';
import { v4 as uuid } from 'uuid';
interface selection{
    end: number;
    start: number;
    startNodeDom: Node | null;
    endNodeDom: Node | null;
}

let textsState:Array<textLinkNode>= [
    {type:"textNode",id:uuid(),marks:["editor-h1"],state:"new",content:"我他妈写不来1"},
    {type:"textNode",id:uuid(),marks:["editor-h2"],state:"new", content:"我他妈写不来2"},
    {type:"textNode",id:uuid(),marks:["editor-h3"],state:"new", content:"我他妈写不来3"},
    {type:"textNode",id:uuid(),marks:["editor-text"],state:"new", content:"我他妈写不来4"},
    {type:"textNode",id:uuid(),marks:["editor-text"],state:"new", content:"我他妈写不来5"}
  ]

export const changeTextState= (selection:selection)=>{
    const {end,start,startNodeDom,endNodeDom} = selection
    if(!end||!start||!startNodeDom||!endNodeDom){
      return;
    }
    //获取虚拟Dom
    //@ts-ignore
    const startNodeId = startNodeDom?.parentNode?.id
    //@ts-ignore
    const endNodeId = endNodeDom?.parentNode?.id
    const row = [startNodeId,endNodeId]
    const findNodes = textsState.filter((node)=>row.indexOf(node.id)!==-1)
    if(!findNodes){
      return;
    } 
    const startNodeIndex =textsState.indexOf(findNodes[0] as textLinkNode)
    const endNodeIndex =textsState.indexOf(findNodes[findNodes.length-1] as textLinkNode)  
    const selectedNodes = []
    for(let i = startNodeIndex;i<=endNodeIndex;i++){
    textsState[i].state = 'delete'
      selectedNodes.push(textsState[i])
    }
    let mountElement = document.querySelector('.content>div')
    if(mountElement===null){
      return
    }
    const startNode={...findNodes[0]}
    const endNode  ={...findNodes[findNodes.length-1]}
    const startNodeContent =  startNode.content.slice(0,start)
    const endNodeContent   =  endNode.content.slice(end,findNodes[findNodes.length-1].content.length)    
    startNode.content = startNodeContent 
    endNode.content   = endNodeContent
    startNode.state = 'change'
    endNode.state = 'new'
    endNode.id = uuid()  
    const newNode ={type:"textNode",id:uuid(),marks:["editor-text","text-purple-600"],state:"new",content:"我插进来了欧"}
    
    //对真实Dom进行渲染
    if(selectedNodes.length==1){
        textsState.splice(startNodeIndex,1,startNode,newNode,endNode)
    }
    if(selectedNodes.length>1){
       textsState.splice(startNodeIndex,1,startNode,newNode,endNode)
    }
    textNodeLinkListChange(textsState)
    
    textsState = textsState.filter((textLinkNode)=>textLinkNode.state==='static')
    // textNodeLinkListRerender2(mountElement,textsState,newNode)
    //设置State
    // if(selectedNodes.length>1){
    //   textsState = [...textsState.splice(startNodeIndex+1,endNodeIndex-startNodeIndex-1,newNode)]
    // }
    // console.log(textsState)
}




export const initTextState = ()=>{
    console.log("Create")
    const contentDom = document.querySelector('.content')
    let mountElement = document.createElement('div')
    contentDom?.appendChild(mountElement)
    if(mountElement){
      if(contentDom?.hasChildNodes()){
      }
      textNodeLinkList(textsState)
    }
}
