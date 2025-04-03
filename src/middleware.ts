import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getIronSession } from "iron-session";
import { sessionOptions, type MySessionData } from "@/libs/session";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const session = await getIronSession<MySessionData>(req, res, sessionOptions);

  if (!session.email && req.nextUrl.pathname.startsWith("/dashboard")) {
    console.log("🚪 Sesja wygasła – redirect na /");
    return NextResponse.redirect(new URL("/", req.url));
  }

  return res;
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
