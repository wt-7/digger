import { LetterCaseCapitalizeIcon } from "@radix-ui/react-icons";
import { FieldProps } from "../search-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Toggle } from "../ui/toggle";

export function CaseSensitiveField({ form }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="case_sensitive"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Toggle
              className=""
              pressed={field.value}
              onPressedChange={field.onChange}
            >
              <LetterCaseCapitalizeIcon className="w-4 h-4" />
            </Toggle>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
