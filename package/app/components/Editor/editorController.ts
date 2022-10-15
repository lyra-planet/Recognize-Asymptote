import type { MutableRefObject } from 'react';
import { getCursor, resetCursor } from '~/hook/getCursor';
import { selection, T_ControllState } from './index';
import { changeTextState } from './textLinkNodeListState';

 class EditorController {
    selection:selection
    controllState:T_ControllState
    constructor(){
        this.selection = {
            end: 0,
            start: 0,
            startNodeDom: null,
            endNodeDom: null, 
        }
        this.controllState = 'type'
    }
    selectionChangeController = ()=>{
        document.addEventListener("selectionchange", (e) => {});
      }
    mouseUpController = ()=>{
        document.addEventListener("mouseup", () => {
          this.mouseUpAction()
        });
      }
    keyUpController = ()=>{
        document.addEventListener("keyup", (e) => {
          this.keyUpAction(e)
        });
      }
    mouseUpAction=()=>{
        this.selection = getCursor() as selection;
        this.insertAction()
      }
    keyUpAction = (e: KeyboardEvent)=>{
        if (this.controllState === "type") {
            changeTextState(this.selection, this.controllState, e.key);
          switch (e.key.length) {
            case 1:
                this.nomarlltypeAction()
              break;
            default:
              switch (e.key) {
                case "Enter":
                    this.enterAction()
                  break;
                case "Backspace":
                    this.backspaceAction()
                  break;
              }
          }
        }
        resetCursor();
      }
    insertAction = ()=>{
        if (this.controllState === "insert" || this.controllState === "change") {
          changeTextState(this.selection, this.controllState);
        }
      }
    nomarlltypeAction=()=>{
        this.selection = {
          ...this.selection,
          start: this.selection.start + 1,
          end: this.selection.start + 1,
        };
      }
    backspaceAction = ()=>{
        this.selection = {
          ...this.selection,
          start: this.selection.start - 1,
          end: this.selection.start - 1,
        };
        if (!this.selection.startNodeDom) {
          return;
        }
        if (this.selection.start <= 0) {
          const currentDom = document.querySelector(
            `#${this.selection.startNodeDom.id}`
          );
          const previousDom = currentDom?.previousElementSibling;
          if (!previousDom) {
            return;
          }
          if (
            previousDom?.tagName !== "P" &&
            this.selection.start < 0
          ) {
            const currentRowDom = document.querySelector(
              `#${this.selection.startNodeDom.attributes[3].value}`
            );
            if (currentRowDom) {
              if (currentRowDom.previousElementSibling) {
                const lastChildDom =
                  currentRowDom.previousElementSibling.lastElementChild;
                if (!lastChildDom?.textContent) {
                  return;
                }
                this.selection = {
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
            this.selection = {
              startNodeDom: previousDom,
              endNodeDom: previousDom,
              start: previousDom.textContent?.length,
              end: previousDom.textContent?.length,
            };
          }
        }
      }
    enterAction = ()=>{
        if (!this.selection.startNodeDom) {
          return;
        }
        const currentRowDom = document.querySelector(
          `#${this.selection.startNodeDom.attributes[3].value}`
        );
        if (currentRowDom) {
          if (currentRowDom.nextElementSibling) {
            this.selection= {
              startNodeDom:
                currentRowDom.nextElementSibling.children[1],
              endNodeDom: currentRowDom.nextElementSibling.children[1],
              start: 0,
              end: 0,
            };
          }
        }
      }
    init = ()=>{
        this.selectionChangeController()
        this.mouseUpController()
        this.keyUpController()
    }
}

export const editorController = ()=>new EditorController().init()