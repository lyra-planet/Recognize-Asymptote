export type T_State = "new"|"change"|"delete"|"static"
export interface textLinkNode{
    type: string;
    id:string;
    content:string;
    state:T_State;
    marks:Array<string>;
}
export type textLinkNodeList = Array<textLinkNode>
interface textLinkNodeListFunc{
    (textLinkNodeList:textLinkNodeList):void
}
//初始化Dom链表
export const textNodeLinkList:textLinkNodeListFunc = (textLinkNodeList)=>{
    let mountElement = document.querySelector('.content>div') as Element
    textLinkNodeList.map((textLinkNode)=>{
     const element = createLinkNodeDom(textLinkNode)
     textLinkNode.state = "static"
     mountElement.appendChild(element)
    })
}
interface textNodeLinkListChangeFunc{
    (textLinkNodeList:textLinkNodeList):void
}
export const textNodeLinkListVDomToDom:textNodeLinkListChangeFunc = (textLinkNodeList)=>{
    let beforeElement:HTMLElement|null = null
    textLinkNodeList.map((textLinkNode,index)=>{
        switch (textLinkNode.state){
            case "new":
            beforeElement = new_generateTextNodeDom(index,textLinkNode,beforeElement as HTMLElement)
            return true
            case "change":
            beforeElement = change_generateTextNodeDom(textLinkNode,beforeElement as HTMLElement) 
            return true
            case "delete":
            delete_generateTextNodeDom(textLinkNode)   
            return true
            case "static":
            beforeElement = static_generateTextNodeDom(textLinkNode,beforeElement as HTMLElement)
            return true
            default:
            return false
        }
    })

}
//------------------------------------------
interface I_new_generateTextNodeDom{
    (index:number,textLinkNode:textLinkNode,beforeElement:HTMLElement):HTMLElement
}
export const new_generateTextNodeDom:I_new_generateTextNodeDom = (index,textLinkNode,beforeElement)=>{
    let mountElement = document.querySelector('.content>div') as Element
    const element = createLinkNodeDom(textLinkNode)
    
    if(index===0){  
        insertBefore(element,mountElement.firstElementChild as Element)
        textLinkNode.state = "static"
    }
    if(index>0){
        insertAfter(element,beforeElement) 
        textLinkNode.state = "static"
    }
    return document.getElementById(textLinkNode.id) as HTMLElement
}
interface I_change_generateTextNodeDom{
    (textLinkNode:textLinkNode,beforeElement:Element):HTMLElement
}
export const change_generateTextNodeDom:I_change_generateTextNodeDom = (textLinkNode,beforeElement)=>{
    let mountElement = document.querySelector('.content>div') as Element
    const element = createLinkNodeDom(textLinkNode)
    const beforeChangeElement = document.getElementById(textLinkNode.id)
    mountElement.replaceChild(element,beforeChangeElement as HTMLElement)
    textLinkNode.state = "static"
    return document.getElementById(textLinkNode.id) as HTMLElement
}
interface I_static_generateTextNodeDom{
    (textLinkNode:textLinkNode,beforeElement:Element|null):HTMLElement
}
export const static_generateTextNodeDom:I_static_generateTextNodeDom = (textLinkNode,beforeElement)=>{
    const beforeChangeElement = document.getElementById(textLinkNode.id) as HTMLElement
    return beforeChangeElement as HTMLElement
}
interface I_delete_generateTextNodeDom{
    (textLinkNode:textLinkNode):void
}
export const delete_generateTextNodeDom:I_delete_generateTextNodeDom = (textLinkNode)=>{
    let mountElement = document.querySelector('.content>div') as Element
    const element = document.getElementById(textLinkNode.id)
    console.log(textLinkNode.id)
    mountElement.removeChild(element as HTMLElement)
}
//-------------------------------------------

interface I_createLinkNodeDomFunc{
    (LinkNode:textLinkNode):HTMLElement
}
//根据虚拟Dom创建真实Dom
export const createLinkNodeDom:I_createLinkNodeDomFunc =(LinkNode)=>{
  const element = document.createElement("p")
  element.id = LinkNode.id
  element.classList.add(LinkNode.type)
  element.setAttribute("type",LinkNode.type)
  if(LinkNode.marks.length!=0){
    element.classList.add(...LinkNode.marks)
  }
  element.innerText = LinkNode.content 
  return element
}
interface textLinkNodeDomReplaceFunc{
    (mountElement:Element,LinkNode:textLinkNode):void
}
//Dom节点的替换
export const textLinkNodeDomReplace:textLinkNodeDomReplaceFunc=(mountElement,LinkNode)=>{
    const nexNode = createLinkNodeDom(LinkNode) 
    const preNode = document.getElementById(LinkNode.id)
    if(LinkNode.id&&nexNode&&preNode){
        mountElement.replaceChild(nexNode,preNode)
    }
    return
}
export interface selectedNodeChangeData{
    nodes:Array<textLinkNode>,
    accuratePosition:{start:number,end:number}
  }
//将选中的Dom变更
interface textNodeLinkListRerenderFunc2{
    (mountElement:Element,nodeChangeData:selectedNodeChangeData,newNode:textLinkNode):void
}
export const textNodeLinkListRerender2:textNodeLinkListRerenderFunc2=(mountElement,nodeChangeData,newNode)=>{
    const newNodeDom = createLinkNodeDom(newNode) 
    const nodes = nodeChangeData.nodes
    const {start,end} = nodeChangeData.accuratePosition
    if(nodes[0]===undefined){
        console.log(nodes)
        return
    }
    
    //未选中元素直接返回
    if(nodes.length===0){
        return
    }
    //在单一Dom节点中插入
    if(nodes.length===1&&start===end){
            insertText(nodes[0])
        return
    }
    //对多个Dom节点的操作

    //中间节点的移除
    if(nodes.length!==1){
        nodes.map((node,index)=>{
            if(index!==0&&index!==nodes.length-1){
                const willRemoveNode = document.getElementById(node.id)
                if(willRemoveNode){
                    mountElement.removeChild(willRemoveNode)
                } 
            }
        })
    }
    //首尾节点content的截取
    
    const startNode=nodes[0]
    const endNode  =nodes[nodes.length-1]
    const startNodeContent =  startNode.content.slice(0,start)
    const endNodeContent   =  endNode.content.slice(end,nodes[nodes.length-1].content.length)    
    startNode.content =startNodeContent
    endNode.content   =endNodeContent
    textLinkNodeDomReplace(mountElement,startNode)
    textLinkNodeDomReplace(mountElement,endNode)
    const startNodeDom = document.getElementById(startNode.id)
    const endNodeDom = document.getElementById(endNode.id)
    if(!startNodeDom||!endNodeDom){
        return
    }
    //Dom节点的插入
    insertAfter(newNodeDom,startNodeDom)
    //-----------
    //清除空的Dom节点
    if(start===0){
        mountElement.removeChild(startNodeDom)
    }
    if(end===endNodeContent.length){
        mountElement.removeChild(endNodeDom)
    }
    return

}
interface I_insertText{
    (node:textLinkNode):void
}
export const insertText:I_insertText=(node)=>{
    document.addEventListener("keyup",(e)=>{
        node.content+=e.key
    })
    console.log(node.content)
    return 
}
interface I_insertAfter{
    (newElement:HTMLElement, targetElement:Element):void
}
//在targetElement之后插入 新节点newElement
export const insertAfter:I_insertAfter =(newElement, targetElement)=>{
    let mountElement = document.querySelector('.content>div') as Element
    if(!mountElement){
        return
    }
    if(mountElement.lastChild == targetElement){
        
        mountElement.appendChild(newElement);
    }else{
        // console.log(targetElement.nextSibling)
        // console.log(mountElement)
        mountElement.insertBefore(newElement,targetElement.nextSibling);
    }
}
interface I_insertBefore{
    (newElement:HTMLElement, targetElement:Element):void
}
export const insertBefore:I_insertBefore =(newElement, targetElement)=>{
    let mountElement = document.querySelector('.content>div') as Element
    if(!mountElement){
        return
    }
    if(!targetElement){
        mountElement.appendChild(newElement);
    }else{
        mountElement.insertBefore(newElement,targetElement);
    }
}

