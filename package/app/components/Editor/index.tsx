
import { useEffect} from 'react';
import { changeTextState, initTextState } from './textLinkNodeListState';

interface selection{
    end: number;
    start: number;
    startNodeDom: Node | null;
    endNodeDom: Node | null;
}
const index = () => {
   useEffect(()=>{
    initTextState()
    document.addEventListener('selectionchange',(e)=>{})
    document.addEventListener("mouseup",()=>{   
    const selection =  getCursor() as selection 
    changeTextState(selection)
    })
    document.addEventListener("keyup",()=>{
    })
   },[])
  const getCursor=()=>{
    let sel = getSelection()
    if(!sel){
        return;
    }
    //取消选择其他
    const startNodeType =  sel.anchorNode?.parentElement?.classList[0]
    const endNodeType =  sel.focusNode?.parentElement?.classList[0]
    if(startNodeType!=='textNode'||endNodeType!=='textNode'){
      return {    
        end: 0,
        start: 0,
        startNodeDom: null,
        endNodeDom: null,}
    }
    //获取鼠标位置
    const end = sel.focusOffset
    const start =sel.anchorOffset
    const startNodeDom = sel.anchorNode
    const endNodeDom = sel.focusNode
    return {
        end,
        start,
        startNodeDom,
        endNodeDom
    }

  }

  return (
    <div className='content'/>
  )
}

export default index