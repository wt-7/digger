import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MatchContext } from "@/lib/hooks/use-files";

interface ContextHoverCard {
  needle: string;
  matches: Array<MatchContext>;
}

export function ContextHoverCard({ needle, matches }: ContextHoverCard) {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button
          className={cn(
            "h-6 rounded-md px-2.5 py-0.5 text-xs font-semibold truncate"
          )}
        >
          {needle}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="max-w-80">
        <div>
          {matches.map((match, index) => (
            <div key={index} className="truncate">
              <span className="font-normal text-muted-foreground">
                {match.prefix}
              </span>
              <span className="font-semibold">{match.infix}</span>
              <span className="font-normal text-muted-foreground">
                {match.postfix}
              </span>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
