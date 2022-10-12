export const getCursor = () => {
  let sel = window.getSelection();
  if (!sel) {
    return;
  }
  //取消选择其他
  const startNodeType = sel.anchorNode?.parentElement?.classList[0];
  const endNodeType = sel.focusNode?.parentElement?.classList[0];
  if (startNodeType !== "textNode" || endNodeType !== "textNode") {
    return {
      end: 0,
      start: 0,
      startNodeDom: null,
      endNodeDom: null,
    };
  }
  //获取鼠标位置
  const end = sel.focusOffset;
  const start = sel.anchorOffset;
  const startNodeDom = sel.anchorNode;
  const endNodeDom = sel.focusNode;
  console.log(sel)
  return {
    end,
    start,
    startNodeDom,
    endNodeDom,
  };
};

export const resetCursor = () => {
  let sel = window.getSelection();
  if (!sel) {
    return;
  }
  sel.removeAllRanges()
};
