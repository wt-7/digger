import { LetterCaseCapitalizeIcon } from "@radix-ui/react-icons";
import { FieldProps } from "../search-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Toggle } from "../ui/toggle";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export function CaseSensitiveField({ form }: FieldProps) {
  return (
    <FormField
      control={form.control}
      name="case_sensitive"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Toggle
                    className="w-full"
                    pressed={field.value}
                    onPressedChange={field.onChange}
                  >
                    <LetterCaseCapitalizeIcon className="w-4 h-4" />
                  </Toggle>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {field.value ? "Disable" : "Enable"} case-sensitivity
              </TooltipContent>
            </Tooltip>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
