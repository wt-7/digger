import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Search } from "@/lib/hooks/use-files";

export function StatsToast({ search }: { search: Search }) {
  return (
    <div className="w-full">
      <Table>
        <TableBody>
          <TableRow>
            <TableCell className="font-semibold text-xs">
              Duration (ms)
            </TableCell>
            <TableCell className="text-xs tabular-nums">
              {search.duration}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-xs">
              Matching files
            </TableCell>
            <TableCell className="text-xs tabular-nums">
              {search.files.length}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-xs">
              Files searched
            </TableCell>
            <TableCell className="text-xs tabular-nums">
              {search.files_searched}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-semibold text-xs">
              Entries found
            </TableCell>
            <TableCell className="text-xs tabular-nums">
              {search.entries_checked}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
