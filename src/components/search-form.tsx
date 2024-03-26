import { UseFormReturn, useFormContext } from "react-hook-form";
import * as z from "zod";
import { Form } from "./ui/form";
import { currentPreview, currentSearch } from "@/atoms";
import { useAtom, useSetAtom } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import { isEqual } from "radash";
import { NeedleFields } from "./form/needle-fields";
import { PathField } from "./form/path-field";
import { ExtensionField } from "./form/extension-field";
import { rowSelectionAtom } from "./data-table/file-table";

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
  const setRowSelection = useSetAtom(rowSelectionAtom);
  const setPreviewFile = useSetAtom(currentPreview);

  const handleSubmit = async (data: SearchFormValues) => {
    // Clear the row selection and preview file when a new search is submitted
    // This will prevent the preview file from being displayed when the search results are updated
    setRowSelection({});
    setPreviewFile(undefined);
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
        id="main"
        // HTML attribute to allow the form to be submitted elsewhere.
        // TODO: refactor sidebar
      >
        <PathField form={form} />
        <ExtensionField form={form} />
        <NeedleFields form={form} />
      </form>
    </Form>
  );
}

export interface FieldProps {
  form: UseFormReturn<SearchFormValues>;
}
