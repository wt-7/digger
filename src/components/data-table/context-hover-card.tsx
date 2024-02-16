import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MatchContext } from "@/lib/hooks/use-files";
import { Table, TableRow, TableBody, TableCell } from "../ui/table";

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
      <HoverCardContent className="w-full max-h-96 overflow-y-auto">
        <Table>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{match.line}</TableCell>
                <TableCell>
                  <p>
                    <span className="font-normal text-muted-foreground">
                      {match.prefix}
                    </span>
                    <span className="font-semibold">{match.infix}</span>
                    <span className="font-normal text-muted-foreground">
                      {match.postfix}
                    </span>
                  </p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </HoverCardContent>
    </HoverCard>
  );
}
