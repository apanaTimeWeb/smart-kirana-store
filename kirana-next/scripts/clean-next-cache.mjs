import { rmSync } from "node:fs";
import { resolve } from "node:path";

const target = resolve(process.cwd(), ".next");

try {
  rmSync(target, { recursive: true, force: true });
  console.log("[clean] Removed .next cache/build output.");
} catch (error) {
  console.warn("[clean] Could not remove .next:", error.message);
}
