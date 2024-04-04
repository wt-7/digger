import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { MatchContext } from "@/lib/hooks/use-files";
import { Table, TableRow, TableBody, TableCell } from "../ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

interface ContextPopoverProps {
  needle: string;
  matches: Array<MatchContext>;
}

export function ContextPopover({ needle, matches }: ContextPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className={cn(
            "h-6 rounded-md px-2.5 py-0.5 text-xs font-semibold truncate"
          )}
        >
          {needle}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full max-h-96 overflow-y-auto dark:[color-scheme:dark]">
        <Table>
          <TableBody>
            {matches.map((match, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{match.line}</TableCell>
                <TableCell>
                  <p className="font-mono">
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
      </PopoverContent>
    </Popover>
  );
}
