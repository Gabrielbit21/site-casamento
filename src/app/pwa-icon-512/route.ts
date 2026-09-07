import { createPwaIcon } from "@/lib/pwaIcon";

export const runtime = "nodejs";
export const dynamic = "force-static";

export function GET() {
  return createPwaIcon(512);
}