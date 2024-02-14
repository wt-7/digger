import { atom } from "jotai";
import { SearchFormValues } from "./components/form";
import { DEFAULT_FORM_VALUES } from "./lib/consts";
import { MatchedFile } from "./lib/hooks/use-files";

export const currentSearch = atom<SearchFormValues>(DEFAULT_FORM_VALUES);

export const currentPreview = atom<MatchedFile | undefined>(undefined);
