import { useEffect, useState, useRef } from 'react';
import { changeTextState, initTextState } from './textLinkNodeListState';
import {getCursor} from '../../hook/getCursor';
interface selection{
    end: number;
    start: number;
    startNodeDom: Node | null;
    endNodeDom: Node | null;
}

export type T_ControllState = 'type'|'insert'|'change'|'delete'

const EditorController = () => {
  const [controllState,setControllState] = useState<T_ControllState>('type')
  let selection =  useRef<selection>(
    {    
    end: 0,
    start: 0,
    startNodeDom: null,
    endNodeDom: null})
   useEffect(()=>{
    initTextState()
    document.addEventListener('selectionchange',(e)=>{})
    document.addEventListener("mouseup",()=>{   
    selection.current =  getCursor() as selection
    if(controllState === 'insert'||controllState === 'change'){
      changeTextState(selection.current,controllState)
    }
    })
    document.addEventListener("keyup",(e)=>{
    if(controllState==='type'){
    changeTextState(selection.current,controllState,e.key)
    selection.current = {...selection.current,start:selection.current.start+1,end:selection.current.start+1}
    }
    })
   },[])

  return (
    <div className='content'/>
  )
}

export default EditorController