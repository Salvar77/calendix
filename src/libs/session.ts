import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

type MySessionData = {
  email?: string;
  grantId?: string;
};

const sessionOptions = {
  password: process.env.SESSION_PASSWORD as string,
  cookieName: "calendix_session",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};

export const session = () =>
  getIronSession<MySessionData>(cookies(), sessionOptions);
