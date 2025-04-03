import { session } from "@/libs/session";
import { redirect } from "next/navigation";

export async function GET() {
  const userSession = await session();
  await userSession.destroy(); // 👈 jedyna potrzebna metoda
  redirect("/?logged-out=1");
}
