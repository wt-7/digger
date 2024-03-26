import { SearchFormValues } from "@/components/form";
import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { toast } from "sonner";

export type MatchContext = {
  line: number;
  prefix: string;
  infix: string;
  postfix: string;
};
export type MatchedFile = TMatchedFile<Date>;
export type Search = TSearch<Date>;

type RawSearch = TSearch<string>;

type Args = SearchFormValues & {
  depth: number;
  ignore_hidden: boolean;
  ignore_case: boolean;
  max_file_size: number | null;
};

export const useFiles = (search: SearchFormValues) => {
  return useQuery({
    queryKey: ["useFiles", search],
    queryFn: async () => {
      const args: Args = {
        path: search.path,
        extensions: search.extensions,
        needles: search.needles,
        depth: 0,
        ignore_hidden: true,
        ignore_case: true,
        max_file_size: null,
      };

      const data = await invoke<RawSearch>("file_search", {
        args: args,
      });

      toast("Search complete", {
        description: `Found ${data.files.length} files in ${data.duration}ms`,
        closeButton: true,
        position: "bottom-left",
      });

      return deserializeSearch(data);
    },

    enabled: !!search.path,
    retryOnMount: false,
    retry: false,
    networkMode: "always",

    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

function deserializeSearch(serialized: RawSearch): Search {
  return {
    ...serialized,
    files: serialized.files.map((file) => ({
      ...file,
      metadata: {
        ...file.metadata,
        modified: new Date(file.metadata.modified),
        created: new Date(file.metadata.created),
        accessed: new Date(file.metadata.accessed),
      },
    })),
  };
}

type TSearch<T> = {
  files: TMatchedFile<T>[];
  duration: number;
  files_searched: number;
  entries_checked: number;
};

type TMatchedFile<T> = {
  path: string;
  extension: string;
  filename: string;
  matches: Record<string, MatchContext[]>;
  metadata: {
    modified: T;
    created: T;
    accessed: T;
    size: number;
  };
};
