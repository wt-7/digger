import { version } from "@/atoms";
import { useAtomValue } from "jotai";

export function Version() {
  const value = useAtomValue(version);

  if (value.state !== "hasData") {
    return <div className="text-muted-foreground text-sm">Loading...</div>;
  }
  return <div className="text-muted-foreground text-sm">{value.data}</div>;
}
