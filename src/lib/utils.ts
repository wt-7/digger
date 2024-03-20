import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Support Linux?
type Platform = "macos" | "windows";

export function getPlatform() {
  // Hack to get the platform synchronously, without typescript complaining
  // This value gets set in tauri::builder::setup
  const temp: any = window;
  return temp["platform"] as Platform;
}
