import { usePreview } from "@/lib/hooks/use-preview";
import CodeMirror, {
  EditorState,
  EditorView,
  ReactCodeMirrorRef,
} from "@uiw/react-codemirror";
import { githubLightInit, githubDarkInit } from "@uiw/codemirror-theme-github";
import { langs, loadLanguage } from "@uiw/codemirror-extensions-langs";
import { useTheme } from "@/providers/theme-provider";
import { MatchedFile } from "@/lib/hooks/use-files";
import { EXTENSIONS } from "@/lib/extensions";
import { atom, useAtomValue } from "jotai";
import { highlightLines } from "@/lib/highlighter";
import React from "react";
import { ErrorAlert } from "./error-alert";
import { toast } from "sonner";
import { Scroller } from "./scroller";

export const EMPTY_PANEL_SIZE = 20;
export const OCCUPIED_PANEL_SIZE = 40;

export const currentPreview = atom<MatchedFile | undefined>(undefined);

export function Preview() {
  const previewFile = useAtomValue(currentPreview);
  const { data, isLoading, isError, error } = usePreview(previewFile);
  const { theme } = useTheme();

  const linesWithMatches = React.useMemo(() => {
    return previewFile ? getMatchLineNumbers(previewFile) : [];
  }, [previewFile]);

  const editorRef = React.useRef<ReactCodeMirrorRef>(null);

  if (!previewFile) {
    return (
      <div className="flex items-center h-full select-none">
        <p className="font-semibold leading-none truncate tracking-tight text-muted-foreground p-2 w-full text-center">
          No preview selected
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center h-full select-none">
        <p className="font-semibold leading-none truncate tracking-tight text-muted-foreground p-2 w-full text-center">
          Loading...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-12">
        <ErrorAlert error={error as Error} />
      </div>
    );
  }

  const language = EXTENSIONS.find(
    (ext) => ext.value === previewFile.extension
  )?.language;

  return (
    <div className="w-full h-screen ">
      <div className="pt-6 px-6 select-none">
        <h2 className="scroll-m-20 border-b pb-2 text-xl font-semibold tracking-tight first:mt-0 truncate">
          {previewFile.filename}
        </h2>
        <div className="py-2 flex">
          <p
            className="text-xs text-muted-foreground font-semibold cursor-copy inline-block truncate"
            onClick={() => {
              navigator.clipboard.writeText(previewFile.path);
              toast.success("Path copied to clipboard");
            }}
          >
            {previewFile.path}
          </p>
        </div>
      </div>
      <CodeMirror
        key={previewFile.path}
        ref={editorRef}
        className="border-y-2"
        value={data}
        theme={theme === "light" ? lightTheme : darkTheme}
        extensions={[
          loadLanguage(language || "textile") || langs.textile(),
          EditorView.editable.of(false),
          EditorState.readOnly.of(true),
          EditorView.lineWrapping,
          highlightLines({ lines: linesWithMatches }),
        ]}
        maxHeight="calc(100vh - 200px)"
        basicSetup={{
          highlightSelectionMatches: false,
          lineNumbers: true,
          foldGutter: false,
          highlightActiveLine: false,
          highlightActiveLineGutter: false,
          searchKeymap: false,
        }}
      />
      <div>
        <Scroller editorRef={editorRef} matchIndexes={linesWithMatches} />
      </div>
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

function getMatchLineNumbers(file: MatchedFile) {
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
