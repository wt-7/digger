import type { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { useAtomValue } from "jotai";
import React from "react";
import { Button } from "./ui/button";
import { currentPreview } from "./preview";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  DoubleArrowDownIcon,
  DoubleArrowUpIcon,
} from "@radix-ui/react-icons";

interface MatchNavigationProps {
  editorRef: React.RefObject<ReactCodeMirrorRef>;
  linesWithMatches: number[];
}

export function MatchNavigation({
  editorRef,
  linesWithMatches,
}: MatchNavigationProps) {
  const [currentLine, setCurrentLine] = React.useState<number | null>(null);
  const previewFile = useAtomValue(currentPreview);

  // biome-ignore lint/correctness/useExhaustiveDependencies: Only reset the current line when the preview file changes
  React.useEffect(() => {
    setCurrentLine(null);
  }, [previewFile]);

  return (
    <div className="flex flex-col items-center">
      <div className="inline-flex gap-2 rounded-xl border">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="select-none"
              onClick={() => {
                const firstMatchIndex = 0;
                setCurrentLine(firstMatchIndex);
                scrollToLineCentered(
                  editorRef,
                  linesWithMatches[firstMatchIndex]
                );
              }}
            >
              <DoubleArrowUpIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>First</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="select-none"
              onClick={() => {
                const prevLineIndex =
                  currentLine === null || currentLine === 0
                    ? linesWithMatches.length - 1
                    : currentLine - 1;

                setCurrentLine(prevLineIndex);
                scrollToLineCentered(
                  editorRef,
                  linesWithMatches[prevLineIndex]
                );
              }}
            >
              <ChevronUpIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Previous</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="select-none"
              onClick={() => {
                const nextLineIndex =
                  currentLine === null ||
                  currentLine === linesWithMatches.length - 1
                    ? 0
                    : currentLine + 1;

                setCurrentLine(nextLineIndex);
                scrollToLineCentered(
                  editorRef,
                  linesWithMatches[nextLineIndex]
                );
              }}
            >
              <ChevronDownIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Next</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="select-none"
              onClick={() => {
                const lastMatchIndex = linesWithMatches.length - 1;
                setCurrentLine(lastMatchIndex);
                scrollToLineCentered(
                  editorRef,
                  linesWithMatches[lastMatchIndex]
                );
              }}
            >
              <DoubleArrowDownIcon className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Last</TooltipContent>
        </Tooltip>
      </div>
      {currentLine !== null && (
        <div className="grid grid-cols-2 rounded-b-lg border-x border-b w-36 animate-in slide-in-from-top-2 tabular-nums">
          <p className="text-muted-foreground text-sm font-semibold ml-2">
            {linesWithMatches[currentLine]}
          </p>
          <p className="text-muted-foreground text-sm text-right mr-2 border-l">
            {currentLine + 1}/{linesWithMatches.length}
          </p>
        </div>
      )}
    </div>
  );
}

function scrollToLineCentered(
  editorRef: React.RefObject<ReactCodeMirrorRef>,
  lineToView: number
) {
  const { firstVisibleLine, lastVisibleLine } = calcVisibleLines(editorRef);
  const totalVisibleLines = lastVisibleLine - firstVisibleLine;
  const requiredOffset = Math.floor(totalVisibleLines / 2);
  const middleVisibleLine = (firstVisibleLine + lastVisibleLine) / 2;
  const lineCount = calcTotalLines(editorRef);

  const targetLine =
    // When the scroll is dispatched, it will stop as soon as the line is in the view of the editor.
    // To make sure the line is in the middle of the editor, the offset needs to be added or subtracted
    // depending on the direction from which the line is scrolled into view.
    lineToView > middleVisibleLine
      ? lineToView + requiredOffset
      : lineToView - requiredOffset;

  if (targetLine > lineCount) {
    scrollToView(editorRef, lineCount);
  } else if (targetLine < 1) {
    scrollToView(editorRef, 1);
  } else {
    scrollToView(editorRef, targetLine);
  }
}

function scrollToView(
  editorRef: React.RefObject<ReactCodeMirrorRef>,
  line: number
) {
  const cm = editorRef.current;

  if (!cm?.view || !cm?.state) {
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
    throw new Error("Editor not initialized");
  }

  const rect = cm.editor.getBoundingClientRect();
  const docTop = cm.view.documentTop;

  const topVisibleLineBlock = cm.view.lineBlockAtHeight(rect.top - docTop);
  const bottomVisibleLineBlock = cm.view.lineBlockAtHeight(
    rect.bottom - docTop
  );

  const firstVisibleLine = cm.state.doc.lineAt(topVisibleLineBlock.from).number;
  const lastVisibleLine = cm.state.doc.lineAt(
    bottomVisibleLineBlock.from
  ).number;

  return { firstVisibleLine, lastVisibleLine };
}

function calcTotalLines(editorRef: React.RefObject<ReactCodeMirrorRef>) {
  const cm = editorRef.current;

  if (!cm?.state) {
    // This function shouldn't be called if the editor isn't initialized
    throw new Error("Editor not initialized");
  }
  // This should be a very cheap operation
  return cm.state.doc.lines;
}
