import { Sidebar } from "./components/sidebar";
import Page from "./components/page";
// import { ContextMenu } from "./components/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { currentPreview, currentSearch } from "./atoms";
import { SearchFormValues, searchFormSchema } from "./components/search-form";
import { useHotkeys } from "react-hotkeys-hook";
import {
  EMPTY_PANEL_SIZE,
  OCCUPIED_PANEL_SIZE,
  Preview,
} from "./components/preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { TooltipProvider } from "./components/ui/tooltip";
import { DEFAULT_FORM_VALUES } from "./lib/consts";
import { cn } from "./lib/utils";
import { useEffect, useRef, useState } from "react";
import { DragRegion } from "./components/drag-region";
import { ImperativePanelHandle } from "react-resizable-panels";
import { useOperatingSystem } from "./lib/hooks/use-os";

function App() {
  const formValues = useAtomValue(currentSearch);
  const previewFile = useAtomValue(currentPreview);
  const [mainSectionCollapsed, setMainSectionCollapsed] = useState(false);
  const os = useOperatingSystem();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    values: formValues,
    mode: "onSubmit",
  });

  useHotkeys("meta+r", () => form.reset(DEFAULT_FORM_VALUES));
  useHotkeys("meta+shift+r", () => window.location.reload());

  const previewPanelRef = useRef<ImperativePanelHandle>(null);

  useEffect(() => {
    // Resize the preview panel based on the preview file
    const panel = previewPanelRef.current;
    const panelSize = panel?.getSize() || 0;
    if (!previewFile) {
      // No preview file, make the preview panel small
      panel?.resize(EMPTY_PANEL_SIZE);
    } else if (panelSize < OCCUPIED_PANEL_SIZE) {
      // There is a preview file, but the preview panel is smaller than default
      panel?.resize(OCCUPIED_PANEL_SIZE);
    }
  }, [previewFile]);

  return (
    <TooltipProvider>
      <FormProvider {...form}>
        {/* <ContextMenu> */}

        {os === "macos" && <DragRegion />}
        <div className="min-h-screen flex bg-background">
          <Sidebar />
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel
              defaultSize={80}
              minSize={30}
              collapsible
              onCollapse={() => {
                setMainSectionCollapsed(true);
              }}
              collapsedSize={2}
              onExpand={() => {
                setMainSectionCollapsed(false);
              }}
              className={cn(
                mainSectionCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <Page formValues={formValues} collapsed={mainSectionCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize={EMPTY_PANEL_SIZE}
              ref={previewPanelRef}
            >
              <Preview file={previewFile} />
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
        {/* </ContextMenu> */}
      </FormProvider>
    </TooltipProvider>
  );
}

export default App;
