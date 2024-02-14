import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { DebouncedInput } from "../debounced-input";
import { DataTableColumnVis } from "./data-table-column-vis";
import {
  DataTableFacetedFilter,
  FacetedFilter,
} from "./data-table-faceted-filter";
import { DataTablePagination } from "./data-table-pagination";
import { useAtom } from "jotai";
import { currentPreview } from "@/atoms";
import { MatchedFile } from "@/lib/hooks/use-files";
import { RowContextMenu } from "./row-context";

interface FileTableProps {
  columns: ColumnDef<MatchedFile>[];
  data: MatchedFile[];
  defaultVisbilility: VisibilityState;
  facetedFilters?: FacetedFilter[];
}

export function FileTable({
  columns,
  data,
  defaultVisbilility,
}: FileTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(defaultVisbilility);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableMultiRowSelection: false,
    // Mutli row selection must be off for the preview to work

    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
  });

  const [, setPreviewFile] = useAtom(currentPreview);

  const extensions = new Set(data.map((file) => file.extension));

  return (
    <div className="@container/datatable">
      <div className="flex justify-end pb-4 space-x-2">
        <DebouncedInput
          placeholder="Search..."
          value={globalFilter || ""}
          onChange={(value) => setGlobalFilter(String(value))}
          className={"w-full h-8"}
        />

        <DataTableFacetedFilter
          key={"extension"}
          table={table}
          filter={{
            filterColumn: "extension",
            title: "Extension",
            options: Array.from(extensions)
              .sort()
              .map((status) => ({
                value: status,
                label: status,
              })),
          }}
        />

        <DataTableColumnVis table={table} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <RowContextMenu row={row} key={row.id}>
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => {
                      row.toggleSelected();
                      if (row.getIsSelected()) {
                        setPreviewFile(undefined);
                      } else {
                        setPreviewFile(row.original);
                      }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                </RowContextMenu>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="hidden py-2 overflow-hidden @lg/datatable:block">
        <DataTablePagination table={table} />
      </div>
    </div>
  );
}
