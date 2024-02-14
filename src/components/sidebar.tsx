import { DiggerIcon } from "./digger-icon";
import { SearchForm } from "./form";
import { ThemeToggle } from "./theme-toggle";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

export function Sidebar() {
  return (
    <div className="border-r flex flex-col items-center">
      <DiggerIcon className="text-primary w-24 mt-2" />
      <ScrollArea className="h-[calc(100vh-12.0rem)] mt-2">
        <div className="items-center p-4 gap-4">
          <SearchForm />
          <ScrollBar className="hidden" />
          {/* Scrollbar hidden as native as native one gets duplicated, however, the functionality is needed */}
        </div>
      </ScrollArea>
      <div className="flex p-4 gap-4 w-full">
        <ThemeToggle />
      </div>
    </div>
  );
}
