import nextAppSession from "next-app-session";

type MySessionData = {
  email?: string;
  grantId?: string;
};

export const session = nextAppSession<MySessionData>({
  name: "calendix_session",
  secret: process.env.SECRET,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  },
});
