import { session } from "@/libs/session";
import { NextResponse } from "next/server";

export async function GET() {
  const userSession = await session();
  await userSession.destroy();
  return NextResponse.redirect(
    new URL("/?logged-out=1", process.env.NEXT_PUBLIC_URL)
  );
}
