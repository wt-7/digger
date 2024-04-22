// Indexing out of bounds will be undefined, which is fine

import { useQuery } from "@tanstack/react-query";
import { type } from "@tauri-apps/api/os";

export type OperatingSystem = "linux" | "windows" | "macos" | "unknown";

async function getOperatingSystem(): Promise<OperatingSystem> {
  const os = await type();
  if (os === "Linux") return "linux";
  if (os === "Windows_NT") return "windows";
  if (os === "Darwin") return "macos";
  return "unknown";
}

export function guessOperatingSystem(): OperatingSystem {
  const userAgent = navigator.userAgent;
  if (userAgent.includes("Win")) return "windows";
  if (userAgent.includes("Mac")) return "macos";
  if (userAgent.includes("X11") || userAgent.includes("Linux")) return "linux";
  return "unknown";
}

export function useOperatingSystem(): OperatingSystem {
  const { data } = useQuery({
    queryKey: ["os"],
    queryFn: async () => await getOperatingSystem(),
    initialData: guessOperatingSystem,
    // Don't refetch the OS
    staleTime: Infinity,
    cacheTime: Infinity,
  });

  return data;
}
