import { UseFormReturn } from "react-hook-form";
import { SearchFormValues } from "../search-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { open } from "@tauri-apps/api/dialog";

interface FieldProps {
  form: UseFormReturn<SearchFormValues>;
}

export function PathField({ form }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="path"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Button
              type="button"
              size="sm"
              variant={field.value ? "outline" : "default"}
              className="w-full"
              onClick={async () => {
                const selected = (await open({
                  directory: true,
                  multiple: false,
                })) as string | null;

                selected
                  ? field.onChange(selected)
                  : form.resetField("path", { defaultValue: "" });
              }}
            >
              <span className="truncate">
                {field.value ? field.value : "Select folder"}
              </span>
            </Button>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
