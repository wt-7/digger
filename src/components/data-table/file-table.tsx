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
import { useSetAtom } from "jotai";
import { currentPreview } from "@/atoms";
import { MatchedFile } from "@/lib/hooks/use-files";
import { RowContextMenu } from "./row-context-menu";

interface FileTableProps {
  columns: ColumnDef<MatchedFile>[];
  data: MatchedFile[];
  defaultVis: VisibilityState;
  facetedFilters?: FacetedFilter[];
}

export function FileTable({ columns, data, defaultVis }: FileTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [colFilters, setColFilters] = React.useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [colVis, setColVis] = React.useState<VisibilityState>(defaultVis);
  const setPreviewFile = useSetAtom(currentPreview);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColVis,
    onGlobalFilterChange: setGlobalFilter,
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    enableMultiRowSelection: false,
    // Mutli row selection must be off for the preview to work

    state: {
      sorting,
      columnFilters: colFilters,
      columnVisibility: colVis,
      globalFilter,
    },
  });

  const selectedRows = table
    .getSelectedRowModel()
    .rows.map(({ original }) => original);

  React.useEffect(() => {
    // Indexing out of bounds will be undefined, which is fine
    setPreviewFile(selectedRows[0]);
  }, [selectedRows]);

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
