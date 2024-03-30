import { useQuery } from "@tanstack/react-query";
import { invoke } from "@tauri-apps/api/tauri";
import { MatchedFile } from "./use-files";

export const usePreview = (file: MatchedFile | undefined) => {
  return useQuery({
    queryKey: ["usePreview", file],
    queryFn: async () => {
      if (!file) {
        throw new Error("Query should be disabled when path is falsy");
      }
      const data = await invoke<string>("preview_file", {
        path: file.path,
      });

      return data;
    },

    retryOnMount: false,
    retry: false,
    networkMode: "always",

    enabled: !!file,

    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
