import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type MySessionData } from "@/libs/session";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const session = await getIronSession<MySessionData>(req, res, sessionOptions);

  const now = Date.now();
  const expired =
    session.lastActivity && now - session.lastActivity > 60 * 1000;

  console.log("🔥 Middleware działa, path:", req.nextUrl.pathname);
  console.log("🧠 Sesja email:", session.email);
  console.log("🕒 Sesja wygasła?", expired);

  if (expired) {
    console.log("⏳ Sesja wygasła – destroy i redirect");
    await session.destroy();
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!session.email && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🚪 Nie zalogowany – redirect na /");
    await session.destroy();
    return NextResponse.redirect(new URL("/", req.url));
  }

  session.lastActivity = now;
  await session.save();

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
