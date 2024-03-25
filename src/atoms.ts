import { atom } from "jotai";
import { SearchFormValues } from "./components/form";
import { DEFAULT_FORM_VALUES } from "./lib/consts";
import { MatchedFile } from "./lib/hooks/use-files";
import { getVersion } from "@tauri-apps/api/app";
import { loadable } from "jotai/utils";

export const currentSearch = atom<SearchFormValues>(DEFAULT_FORM_VALUES);

export const currentPreview = atom<MatchedFile | undefined>(undefined);

// Get the app version from tauri.conf.json
export const version = loadable(atom(async () => await getVersion()));

export type Platform = "macos" | "windows";

export const platformAtom = atom(() => {
  const temp: any = window;
  return temp["platform"] as Platform;
});
