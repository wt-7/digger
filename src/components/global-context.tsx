import {
  ContextMenu as ContextMenuPrimitive,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { DEFAULT_FORM_VALUES } from "@/lib/consts";
import { useFormContext } from "react-hook-form";

export function ContextMenu({ children }: { children: React.ReactNode }) {
  const form = useFormContext();

  return (
    <ContextMenuPrimitive>
      <ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
      <ContextMenuContent className="w-64">
        <ContextMenuItem inset onSelect={() => form.reset(DEFAULT_FORM_VALUES)}>
          Reset form
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem inset onClick={() => window.location.reload()}>
          Reload
          <ContextMenuShortcut>⌘⇧R</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenuPrimitive>
  );
}
