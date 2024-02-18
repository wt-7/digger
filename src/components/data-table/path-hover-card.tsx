import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

interface PathHoverCardProps {
  path: string;
  filename: string;
}

export function PathHoverCard({ path, filename }: PathHoverCardProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="h-6 rounded-md px-2.5 py-0.5 text-xs font-semibold truncate"
        >
          {filename}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <p className="font-mono text-xs">{path}</p>
      </PopoverContent>
    </Popover>
  );
}
