import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Badge } from "../ui/badge";

interface PathHoverCardProps {
  path: string;
  filename: string;
}

export function PathHoverCard({ path, filename }: PathHoverCardProps) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        {/* Empty div fixes a styling issue with using asChild */}
        <div>
          <Badge variant={"outline"}>{filename}</Badge>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-full">
        <div>{path}</div>
      </HoverCardContent>
    </HoverCard>
  );
}
