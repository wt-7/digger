import { DiggerIcon } from "./digger-icon";
import { SearchForm } from "./search-form";
import { ThemeToggle } from "./theme-toggle";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Version } from "./version";
import { cn } from "@/lib/utils";
import { useOperatingSystem } from "@/lib/hooks/use-os";
import { Button } from "./ui/button";
import { useIsFetching } from "@tanstack/react-query";

export function Sidebar() {
  const os = useOperatingSystem();
  const numQueriesFetching = useIsFetching({ queryKey: ["useFiles"] });
  const isFetching = numQueriesFetching > 0;

  return (
    <div className="border-r flex flex-col items-center select-none bg-muted/30">
      <DiggerIcon
        className={cn(
          "text-primary w-24 shrink-0",
          // Account for the custom titlebar and drag region on macOS
          os === "macos" ? "mt-9" : "mt-2",
        )}
      />
      <ScrollArea className="h-[calc(100vh-16.0rem)] mt-2">
        <div className="items-center p-4 gap-4">
          <SearchForm />
          <ScrollBar className="hidden" />
          {/* Scrollbar hidden as native as native one gets duplicated, however, the functionality is needed */}
        </div>
      </ScrollArea>
      <div className="px-4 w-full">
        <Button
          type="submit"
          form="main"
          className={cn(
            "w-full bg-amber-600 hover:bg-amber-600/90",
            isFetching && "animate-pulse",
          )}
        >
          Dig!
        </Button>
      </div>
      <div className="flex p-4 gap-4 w-full items-center justify-between">
        <ThemeToggle />
        <Version />
      </div>
    </div>
  );
}
