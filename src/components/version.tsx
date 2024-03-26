import { useAtomValue } from "jotai";
import { atom } from "jotai";
import { getVersion } from "@tauri-apps/api/app";
import { loadable } from "jotai/utils";
const version = loadable(atom(async () => await getVersion()));

export function Version() {
  const value = useAtomValue(version);

  if (value.state !== "hasData") {
    return <div className="text-muted-foreground text-sm">Loading...</div>;
  }
  return <div className="text-muted-foreground text-sm">{value.data}</div>;
}
