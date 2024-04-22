import type { FieldProps } from "../search-form";
import { FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { EXTENSIONS } from "@/lib/extensions";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { cn } from "@/lib/utils";

export function ExtensionField({ form }: FieldProps) {
  return (
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
                      <Separator orientation="vertical" className="mx-2 h-4" />
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
                            field.value.includes(option.value),
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
                              EXTENSIONS.map((option) => option.value),
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
                        const isSelected = field.value.includes(option.value);
                        return (
                          <CommandItem
                            key={option.value}
                            // Providing a value fixes the overtype -> backspace issue in the command input,
                            // where the autocomplete values are removed until the entire input is cleared
                            value={option.label}
                            onSelect={() => {
                              isSelected
                                ? field.onChange(
                                    field.value.filter(
                                      (value) => value !== option.value,
                                    ),
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
                                  : "opacity-50 [&_svg]:invisible",
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
  );
}
