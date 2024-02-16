import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";

interface PathHoverCardProps {
  path: string;
  filename: string;
}

export function PathHoverCard({ path, filename }: PathHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          variant={"outline"}
          className="h-6 rounded-md px-2.5 py-0.5 text-xs font-semibold truncate"
        >
          {filename}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-full">
        <p className="font-mono text-xs">{path}</p>
      </HoverCardContent>
    </HoverCard>
  );
}
