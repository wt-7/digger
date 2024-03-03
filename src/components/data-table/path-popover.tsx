import { Button } from "../ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";

interface PathPopoverProps {
  path: string;
  filename: string;
  icon: React.FC<React.SVGProps<SVGSVGElement>> | undefined;
}

export function PathPopover({ path, filename, icon: Icon }: PathPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="h-6 rounded-md px-2.5 py-0.5 text-xs font-semibold truncate"
        >
          {Icon && <Icon className="mr-2" />}
          {filename}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <p className="font-mono text-xs">{path}</p>
      </PopoverContent>
    </Popover>
  );
}
