import { DiggerIcon } from "./digger-icon";
import { SearchForm } from "./form";
import { ThemeToggle } from "./theme-toggle";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Version } from "./version";
import { Platform, cn } from "@/lib/utils";

export interface SidebarProps {
  platform: Platform;
}

export function Sidebar({ platform }: SidebarProps) {
  return (
    <div className="border-r flex flex-col items-center select-none bg-muted/20">
      <DiggerIcon
        className={cn(
          "text-primary w-24",
          // Account for the custom titlebar and drag region on macOS
          platform === "macos" ? "mt-9" : "mt-2"
        )}
      />
      <ScrollArea className="h-[calc(100vh-13.0rem)] mt-2">
        <div className="items-center p-4 gap-4">
          <SearchForm />
          <ScrollBar className="hidden" />
          {/* Scrollbar hidden as native as native one gets duplicated, however, the functionality is needed */}
        </div>
      </ScrollArea>
      <div className="flex p-4 gap-4 w-full items-center justify-between">
        <ThemeToggle />
        <Version />
      </div>
    </div>
  );
}
