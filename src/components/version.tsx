import { version } from "@/atoms";
import { useAtom } from "jotai";

export function Version() {
  const [value] = useAtom(version);

  if (value.state !== "hasData") {
    return <div className="text-muted-foreground text-sm">Loading...</div>;
  }
  return <div className="text-muted-foreground text-sm">{value.data}</div>;
}
