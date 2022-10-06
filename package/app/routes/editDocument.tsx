import { MetaFunction } from '@remix-run/node';
import { useEffect, useRef, useState } from 'react';
import Editor from '~/components/Editor'
import {v4 as uuid} from 'uuid'
export const meta: MetaFunction = () => ({

  charset: "utf-8", // <meta charset="utf-8">
  title: "Editor",
  description: "Delicious shakes",
  });

const editDocument = () => {
  const [editorChangerPosition,setEditorChangerPosition] = useState(0)
  const focusRow = useRef(0)
 
  useEffect(()=>{
    document.onkeydown=(e)=>{
      // if(focusRow.current){
      //   console.log(focusRow.current)
      //   let copyTextsList = textsList
      //   switch (e.key){
      //     case "Backspace": 
      //     copyTextsList[focusRow.current-1].text = copyTextsList[focusRow.current-1].text.slice(0, -1) 
      //     break
      //     default:
      //     copyTextsList[focusRow.current-1].text += e.key
      //   }  
      //   setTextList([...copyTextsList])
      // }
    }
    const editorDivs = document.querySelectorAll(".editor>div") 
    const editorChanger= document.getElementById("editor-changer") as HTMLElement
    const editorChangerTop =  editorChanger.getBoundingClientRect().top
    const editorChangerBottom =  editorChanger.getBoundingClientRect().bottom
    const editorChangerSize = (editorChangerBottom-editorChangerTop)
    
    editorDivs.forEach((editorDiv,index)=>{
      editorDiv.addEventListener("mouseover",()=>{
        editorDivs.forEach((editorDiv)=>{editorDiv.classList.remove("edit-mouseover")})
        editorDiv.classList.add("edit-mouseover")
        const editorDivTop =  editorDiv.getBoundingClientRect().top
        const editorDivBottom =  editorDiv.getBoundingClientRect().bottom
        const editorDivSize = (editorDivBottom-editorDivTop)
        const relativePosition = (editorDivSize-editorChangerSize)/2
        const positionChange =editorDiv.getBoundingClientRect().top + relativePosition-editorChangerTop
        setEditorChangerPosition(positionChange)
      })
      editorDiv.addEventListener("click",(e)=>{
        focusRow.current = index+1
    })
    })
    
  },[])
  useEffect(()=>{
    const editorChanger= document.getElementById("editor-changer") as HTMLElement
    editorChanger.style.transform = `translateY(${editorChangerPosition}px)`
  },[editorChangerPosition])
  return (
    <div className='editor-container flex flex-row justify-center w-screen'>
      <div id="editor-changer">
        H1︙
      </div>
      <div id="editor"className="editor w-2/4">
         <Editor/>
      </div>
     
    </div>
  )
}


export default editDocument