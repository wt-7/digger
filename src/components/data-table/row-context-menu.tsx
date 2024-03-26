import {
  ContextMenu as ContextMenuPrimitive,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { MatchedFile } from "@/lib/hooks/use-files";
import { Row } from "@tanstack/react-table";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "sonner";

interface RowContextMenuProps {
  children: React.ReactNode;
  row: Row<MatchedFile>;
}

export function RowContextMenu({ children, row }: RowContextMenuProps) {
  return (
    <ContextMenuPrimitive>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem
          inset
          onSelect={async () =>
            await invoke("open_with_default", { path: row.original.path })
          }
        >
          Open with default app
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={async () =>
            await invoke("open_in_explorer", { path: row.original.path })
          }
        >
          Show in folder
        </ContextMenuItem>
        <ContextMenuItem
          inset
          onClick={() => {
            navigator.clipboard.writeText(row.original.path);
            // write a custom message based on the path
            toast("Path copied to clipboard", {
              description: row.original.path,
              closeButton: true,
              position: "bottom-left",
            });
          }}
        >
          Copy path
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive>
  );
}
