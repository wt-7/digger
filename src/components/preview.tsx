import { usePreview } from "@/lib/hooks/use-preview";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import CodeMirror, { EditorState, EditorView } from "@uiw/react-codemirror";
import { githubLightInit, githubDarkInit } from "@uiw/codemirror-theme-github";
import { langs, loadLanguage } from "@uiw/codemirror-extensions-langs";
import { useTheme } from "@/providers/theme-provider";
import { MatchedFile } from "@/lib/hooks/use-files";
import { EXTENSIONS } from "@/lib/extensions";
import { atom, useAtomValue } from "jotai";
import { highlightLines } from "@/lib/highlighter";
import React from "react";

export const EMPTY_PANEL_SIZE = 20;
export const OCCUPIED_PANEL_SIZE = 40;

export const currentPreview = atom<MatchedFile | undefined>(undefined);

export function Preview() {
  const previewFile = useAtomValue(currentPreview);
  const { data, isLoading, isError, error } = usePreview(previewFile);
  const { theme } = useTheme();

  const matchLines = React.useMemo(() => {
    return previewFile ? getAllLineNumbers(previewFile) : [];
  }, [previewFile]);

  if (!previewFile) {
    return (
      <div className="bg-background flex items-center h-full select-none">
        <p className="font-semibold leading-none truncate tracking-tight text-muted-foreground p-2 w-full text-center">
          No preview selected
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="bg-background flex items-center h-full select-none">
        <p className="font-semibold leading-none truncate tracking-tight text-muted-foreground p-2 w-full text-center">
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col bg-background items-center">
        <h3 className="font-semibold leading-none tracking-tight">
          {String(error)}
        </h3>
      </div>
    );
  }

  const language = EXTENSIONS.find(
    (ext) => ext.value === previewFile.extension
  )?.language;

  return (
    <div className="w-full h-screen">
      <div className="pt-6 px-6 select-none">
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 truncate">
          {previewFile.filename}
        </h2>
        <p className="py-2 text-xs text-muted-foreground truncate font-semibold">
          {previewFile.path}
        </p>
      </div>
      <ScrollArea className="w-full h-full pl-2">
        <ScrollBar orientation="vertical" />
        <div className="py-4">
          <CodeMirror
            value={data}
            theme={theme === "light" ? lightTheme : darkTheme}
            extensions={[
              loadLanguage(language || "textile") || langs.textile(),
              EditorView.editable.of(false),
              EditorState.readOnly.of(true),
              EditorView.lineWrapping,
              highlightLines({ lines: matchLines }),
            ]}
            basicSetup={{
              highlightSelectionMatches: false,
              lineNumbers: true,
              foldGutter: false,
              highlightActiveLine: false,
              highlightActiveLineGutter: false,
            }}
          />
        </div>
      </ScrollArea>
    </div>
  );
}

const darkTheme = githubDarkInit({
  settings: {
    background: "#09090B",
    lineHighlight: "#451a03", // amber-950
  },
});

const lightTheme = githubLightInit({
  settings: {
    lineHighlight: "#fde68a", // amber-200
  },
});

function getAllLineNumbers(file: MatchedFile) {
  const lines = new Set<number>();

  const matches = file.matches;

  Object.keys(matches).forEach((key) => {
    const contexts = matches[key];
    contexts.forEach((context) => {
      lines.add(context.line);
    });
  });

  return Array.from(lines);
}
