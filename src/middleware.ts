import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type MySessionData } from "@/libs/session";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getIronSession<MySessionData>(req, res, sessionOptions);

  console.log("🔥 Middleware działa, path:", req.nextUrl.pathname);
  console.log("🧠 Sesja email:", session.email);

  if (!session.email && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🚪 Nie zalogowany – redirect na /");
    await session.destroy();
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
