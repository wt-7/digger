import { useFieldArray } from "react-hook-form";
import type { FieldProps } from "../search-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";

export function NeedleFields({ form }: FieldProps) {
  const { fields, append, remove } = useFieldArray({
    name: "needles",
    control: form.control,
  });

  return (
    <div className="flex flex-col space-y-2">
      {fields.map((field, index) => (
        <div className="flex space-x-2" key={field.id}>
          <FormField
            control={form.control}
            key={`${field.id}.value`}
            name={`needles.${index}.pattern`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    {...field}
                    className="w-full"
                    placeholder="Add a search term"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            key={`${field.id}.required`}
            name={`needles.${index}.required`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div>
                        {/* Empty div fixes a styling issue with using asChild */}
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="mt-2"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Mark as {field.value ? "optional" : "required"}
                    </TooltipContent>
                  </Tooltip>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <div className="flex justify-between">
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="mt-2 w-10"
          onClick={() => append({ pattern: "", required: true })}
        >
          <PlusIcon />
        </Button>
        {fields.length > 1 && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="mt-2 w-10"
            onClick={() => {
              // Remove the first empty field, or the last field if none are empty.
              const firstEmpty = fields.findIndex(
                (field) => field.pattern === "",
              );

              if (firstEmpty !== -1) {
                remove(firstEmpty);
              } else {
                remove(fields.length - 1);
              }
            }}
          >
            <MinusIcon />
          </Button>
        )}
      </div>
    </div>
  );
}
