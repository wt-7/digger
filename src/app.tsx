import { Sidebar } from "./components/sidebar";
import Page from "./components/page";
// import { ContextMenu } from "./components/context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue } from "jotai";
import { FormProvider, useForm } from "react-hook-form";
import { currentPreview, currentSearch } from "./atoms";
import { SearchFormValues, searchFormSchema } from "./components/form";
import { useHotkeys } from "react-hotkeys-hook";
import { Preview } from "./components/preview";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./components/ui/resizable";
import { TooltipProvider } from "./components/ui/tooltip";
import { DEFAULT_FORM_VALUES } from "./lib/consts";
import { cn } from "./lib/utils";
import { useState } from "react";

function App() {
  const formValues = useAtomValue(currentSearch);
  const previewFile = useAtomValue(currentPreview);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    values: formValues,
    mode: "onSubmit",
  });

  useHotkeys("meta+r", () => form.reset(DEFAULT_FORM_VALUES));
  useHotkeys("meta+shift+r", () => window.location.reload());

  return (
    <TooltipProvider>
      <FormProvider {...form}>
        {/* <ContextMenu> */}
        <div className="min-h-screen flex bg-background">
          <Sidebar />
          <ResizablePanelGroup direction="horizontal" className="min-h-screen">
            <ResizablePanel
              defaultSize={80}
              minSize={30}
              collapsible
              onCollapse={() => {
                setIsCollapsed(true);
              }}
              collapsedSize={2}
              onExpand={() => {
                setIsCollapsed(false);
              }}
              className={cn(
                isCollapsed &&
                  "min-w-[50px] transition-all duration-300 ease-in-out"
              )}
            >
              <Page formValues={formValues} collapsed={isCollapsed} />
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={20}>
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
