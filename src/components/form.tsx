import { UseFormReturn, useFormContext } from "react-hook-form";
import * as z from "zod";
import { Button } from "./ui/button";
import { Form } from "./ui/form";
import { currentSearch } from "@/atoms";
import { useAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "radash";
import { NeedleFields } from "./form/needle-fields";
import { PathField } from "./form/path-field";
import { ExtensionField } from "./form/extension-field";
import { useIsFetching } from "@tanstack/react-query";
import { cn } from "@/lib/utils";

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
  const numQueriesFetching = useIsFetching({ queryKey: ["useFiles"] });
  const isFetching = numQueriesFetching > 0;

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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((data) => handleSubmit(data))}
        className="space-y-6 w-48"
      >
        <PathField form={form} />
        <ExtensionField form={form} />
        <NeedleFields form={form} />
        <Button
          type="submit"
          className={cn(
            "w-full bg-amber-600 hover:bg-amber-600/90",
            isFetching && "animate-pulse"
          )}
        >
          Dig!
        </Button>
      </form>
    </Form>
  );
}

export interface FieldProps {
  form: UseFormReturn<SearchFormValues>;
}
