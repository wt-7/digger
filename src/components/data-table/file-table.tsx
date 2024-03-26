import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
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
import { atom, useAtom, useSetAtom } from "jotai";
import { MatchedFile } from "@/lib/hooks/use-files";
import { RowContextMenu } from "./row-context-menu";
import { defaultVis } from "./columns";
import { currentPreview } from "../preview";

const sortingAtom = atom<SortingState>([]);
const columnFiltersAtom = atom<ColumnFiltersState>([]);
const globalFilterAtom = atom<string>("");
const columnVisibilityAtom = atom<VisibilityState>(defaultVis);
// Exported - this needs to be reset when a new search is submitted.
// Still using an atom, as the the table gets unmounted when the panel is closed
export const rowSelectionAtom = atom<RowSelectionState>({});

interface FileTableProps {
  columns: ColumnDef<MatchedFile>[];
  data: MatchedFile[];
  defaultVis: VisibilityState;
  facetedFilters?: FacetedFilter[];
}

export function FileTable({ columns, data }: FileTableProps) {
  const [sorting, setSorting] = useAtom(sortingAtom);
  const [colFilters, setColFilters] = useAtom(columnFiltersAtom);
  const [globalFilter, setGlobalFilter] = useAtom(globalFilterAtom);
  const [colVis, setColVis] = useAtom(columnVisibilityAtom);
  const [rowSelection, setRowSelection] = useAtom(rowSelectionAtom);

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
    onRowSelectionChange: setRowSelection,
    // Multi row selection must be off for the preview to work

    state: {
      sorting,
      columnFilters: colFilters,
      columnVisibility: colVis,
      globalFilter,
      rowSelection,
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
    <div className="@container/datatable select-none">
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
