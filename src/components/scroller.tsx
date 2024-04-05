import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useAtomValue } from "jotai";
import React from "react";
import { Button } from "./ui/button";
import { currentPreview } from "./preview";

export function Scroller({
  editorRef,
  matchIndexes,
}: {
  editorRef: React.RefObject<ReactCodeMirrorRef>;
  matchIndexes: number[];
}) {
  const [currentLine, setCurrentLine] = React.useState<number | null>(null);
  const previewFile = useAtomValue(currentPreview);

  React.useEffect(() => {
    setCurrentLine(null);
  }, [previewFile]);

  return (
    <div>
      <Button
        className="select-none"
        onClick={() => {
          const lineIndexToScrollTo =
            currentLine === null || currentLine === matchIndexes.length - 1
              ? 0
              : currentLine + 1;
          setCurrentLine(lineIndexToScrollTo);
          const lineToScrollTo = matchIndexes[lineIndexToScrollTo];
          scrollToView(editorRef, lineToScrollTo);
        }}
      >
        Next
      </Button>

      <Button
        className="select-none"
        onClick={() => {
          const lineIndexToScrollTo =
            currentLine === null || currentLine === 0
              ? matchIndexes.length - 1
              : currentLine - 1;
          setCurrentLine(lineIndexToScrollTo);
          const lineToScrollTo = matchIndexes[lineIndexToScrollTo];
          scrollToView(editorRef, lineToScrollTo);
        }}
      >
        Previous
      </Button>

      <Button
        className="select-none"
        onClick={() => {
          const lineIndexToScrollTo = 0;
          setCurrentLine(lineIndexToScrollTo);
          const lineToScrollTo = matchIndexes[lineIndexToScrollTo];
          scrollToView(editorRef, lineToScrollTo);
        }}
      >
        First
      </Button>

      <Button
        className="select-none"
        onClick={() => {
          const lineIndexToScrollTo = matchIndexes.length - 1;
          setCurrentLine(lineIndexToScrollTo);
          const lineToScrollTo = matchIndexes[lineIndexToScrollTo];
          scrollToView(editorRef, lineToScrollTo);
        }}
      >
        Last
      </Button>

      <Button
        className="select-none"
        onClick={() => {
          const visibleLines = calcVisibleLines(editorRef);
          console.log(visibleLines);
        }}
      >
        vis lines
      </Button>

      <div>
        {currentLine !== null ? (
          <p className="text-muted-foreground text-sm">
            {currentLine + 1} of {matchIndexes.length} (line{" "}
            {matchIndexes[currentLine]})
          </p>
        ) : (
          <p> ? of {matchIndexes.length}</p>
        )}
      </div>
    </div>
  );
}

function scrollToView(
  editorRef: React.RefObject<ReactCodeMirrorRef>,
  line: number
) {
  const cm = editorRef.current;

  if (!cm?.view || !cm?.state) {
    // This function shouldn't be called if the editor isn't initialized
    throw new Error("Editor not initialized");
  }

  const lineNode = cm.state.doc.line(line);

  cm.view.dispatch({
    selection: { anchor: lineNode.from },

    scrollIntoView: true,
  });
}

function calcVisibleLines(editorRef: React.RefObject<ReactCodeMirrorRef>) {
  const cm = editorRef.current;

  if (!cm?.editor || !cm?.view || !cm?.state) {
    // This function shouldn't be called if the editor isn't initialized
    throw new Error("Editor not initialized");
  }

  const rect = cm.editor.getBoundingClientRect();
  const docTop = cm.view.documentTop;

  const topVisibleLineBlock = cm.view.lineBlockAtHeight(rect.top - docTop);
  const bottomVisibleLineBlock = cm.view.lineBlockAtHeight(
    rect.bottom - docTop
  );

  const topLineNum = cm.state.doc.lineAt(topVisibleLineBlock.from).number;
  const bottomLineNum = cm.state.doc.lineAt(bottomVisibleLineBlock.from).number;

  return { topLineNum, bottomLineNum };
}
