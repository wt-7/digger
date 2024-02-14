import { ColumnDef } from "@tanstack/react-table";
import { MatchedFile } from "@/lib/hooks/use-files";
import { DataTableColumnHeader } from "./data-table-header";
import { ContextHoverCard } from "./context-hover-card";
import { Badge } from "../ui/badge";
import { PathHoverCard } from "./path-hover-card";

export const columns: ColumnDef<MatchedFile>[] = [
  {
    accessorKey: "path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Path" />
    ),
  },

  {
    accessorKey: "filename",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="File name" />
    ),

    cell: ({ row }) => {
      return (
        <div>
          <PathHoverCard
            path={row.original.path}
            filename={row.original.filename}
          />
        </div>
      );
    },
  },

  {
    accessorKey: "extension",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Extension" />
    ),
  },
  {
    accessorKey: "matches",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Matches" />
    ),
    cell: ({ row }) => {
      const matches = row.original.matches;
      return (
        <div className="flex flex-row space-x-2">
          {Object.entries(matches).map(([key, value]) => (
            <ContextHoverCard key={key} needle={key} matches={value} />
          ))}
        </div>
      );
    },
  },

  {
    id: "modified",
    accessorFn: (row) => row.metadata.modified,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Modified" />
    ),
    cell: (row) => {
      return (
        <span className="font-medium">
          {row.getValue<Date>().toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "accessed",
    accessorFn: (row) => row.metadata.accessed,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Accessed" />
    ),
    cell: (row) => {
      return (
        <span className="font-medium">
          {row.getValue<Date>().toLocaleString()}
        </span>
      );
    },
  },
  {
    id: "created",
    accessorFn: (row) => row.metadata.created,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: (row) => {
      return (
        <span className="font-medium">
          {row.getValue<Date>().toLocaleString()}
        </span>
      );
    },
  },

  {
    id: "size",
    accessorFn: (row) => row.metadata.size,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (KB)" />
    ),
    cell: (row) => {
      return (
        <span className="font-medium">
          {(row.getValue<number>() / 1000).toFixed(2)}
        </span>
      );
    },
  },
];

export const defaultColumnVisibility = {
  path: false,
  extension: false,
  accessed: false,
  created: false,
};
