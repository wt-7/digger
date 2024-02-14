import { useFieldArray, useFormContext } from "react-hook-form";
import * as z from "zod";
import { open } from "@tauri-apps/api/dialog";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "./ui/command";
import {
  CheckIcon,
  MinusIcon,
  PlusCircledIcon,
  PlusIcon,
} from "@radix-ui/react-icons";
import { Separator } from "./ui/separator";
import { Badge } from "./ui/badge";
import { currentSearch } from "@/atoms";
import { useAtom } from "jotai";
import { EXTENSIONS } from "@/lib/consts";
import { Checkbox } from "./ui/checkbox";
import { Tooltip, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "radash";

export const searchFormSchema = z.object({
  path: z.string().min(1, { message: "Required" }),
  extensions: z.array(z.string()).min(1, { message: "Select an extension." }),
  needles: z.array(
    z.object({
      pattern: z.string().max(100).min(1, { message: "Required" }),

      required: z.boolean(),
    })
  ),
});

export type SearchFormValues = z.infer<typeof searchFormSchema>;

export function SearchForm() {
  const [lastSearch, setValues] = useAtom(currentSearch);
  const queryClient = useQueryClient();

  const handleSubmit = async (data: SearchFormValues) => {
    if (isEqual(data, lastSearch)) {
      // If the search has been resubmitted without changes, remove the query to force a refetch.
      // This will trigger the loading UI
      queryClient.removeQueries(["useFiles", data]);
    } else {
      // Otherwise, invalidate the query to trigger a refetch.
      // This will use the cached data if available, without showing the loading UI
      await queryClient.invalidateQueries(["useFiles", data]);
    }

    setValues(data);
  };

  const form = useFormContext<SearchFormValues>();

  const { fields, append, remove } = useFieldArray({
    name: "needles",
    control: form.control,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
        className="space-y-6 w-48"
      >
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

        <FormField
          control={form.control}
          name="extensions"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={field.value.length > 0 ? "outline" : "default"}
                      size="sm"
                      className="h-8 border-dashed w-full whitespace-nowrap"
                    >
                      <PlusCircledIcon className="mr-2 h-4 w-4 shrink-0" />
                      {"Extensions"}
                      {field.value.length > 0 && (
                        <>
                          <Separator
                            orientation="vertical"
                            className="mx-2 h-4"
                          />
                          <Badge
                            variant="secondary"
                            className="rounded-sm px-1 font-normal lg:hidden"
                          >
                            {field.value.length}
                          </Badge>
                          <div className="hidden space-x-1 lg:flex">
                            {field.value.length > 2 ? (
                              <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal"
                              >
                                {field.value.length} selected
                              </Badge>
                            ) : (
                              EXTENSIONS.filter((option) =>
                                field.value.includes(option.value)
                              ).map((option) => (
                                <Badge
                                  variant="secondary"
                                  key={option.value}
                                  className="rounded-sm px-1 font-normal whitespace-nowrap"
                                >
                                  {option.label}
                                </Badge>
                              ))
                            )}
                          </div>
                        </>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder={"Search..."} />
                      <CommandList>
                        <CommandEmpty>No results found.</CommandEmpty>
                        <CommandGroup>
                          {field.value.length < 1 ? (
                            <CommandItem
                              onSelect={() =>
                                field.onChange(
                                  EXTENSIONS.map((option) => option.value)
                                )
                              }
                              className="justify-center text-center"
                            >
                              Select all
                            </CommandItem>
                          ) : (
                            <CommandItem
                              onSelect={() => field.onChange([])}
                              className="justify-center text-center"
                            >
                              Clear all
                            </CommandItem>
                          )}

                          <CommandSeparator className="my-1" />

                          {EXTENSIONS.map((option) => {
                            const isSelected = field.value.includes(
                              option.value
                            );
                            return (
                              <CommandItem
                                key={option.value}
                                value={option.value} // This fixes the overtype -> backspace issue
                                onSelect={() => {
                                  isSelected
                                    ? field.onChange(
                                        field.value.filter(
                                          (value) => value !== option.value
                                        )
                                      )
                                    : field.onChange([
                                        ...field.value,
                                        option.value,
                                      ]);
                                }}
                              >
                                <div
                                  className={cn(
                                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                    isSelected
                                      ? "bg-primary text-primary-foreground"
                                      : "opacity-50 [&_svg]:invisible"
                                  )}
                                >
                                  <CheckIcon className={cn("h-4 w-4")} />
                                </div>

                                <span>{option.label}</span>
                              </CommandItem>
                            );
                          })}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex flex-col space-y-2">
          {fields.map((field, index) => (
            <div className="flex space-x-2" key={index}>
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
                        <TooltipContent>Required?</TooltipContent>
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
                onClick={() => remove(fields.length - 1)}
              >
                <MinusIcon />
              </Button>
            )}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-amber-600 hover:bg-amber-600/90"
        >
          Dig!
        </Button>
      </form>
    </Form>
  );
}
