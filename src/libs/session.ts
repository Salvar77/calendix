// src/libs/session.ts
import { getIronSession } from "iron-session";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export type MySessionData = {
  email?: string;
  grantId?: string;
  lastActivity?: number;
};

export const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "calendix_session",
  cookieOptions: {
    secure: true,
    sameSite: "lax",
    httpOnly: true,
    path: "/",
    maxAge: 10,
  },
};

export const session = () =>
  getIronSession<MySessionData>(cookies(), sessionOptions);

export const getSessionRoute = (req: NextRequest, res: NextResponse) =>
  getIronSession<MySessionData>(req, res, sessionOptions);
