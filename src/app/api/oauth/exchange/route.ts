import { nylas, nylasConfig } from "@/libs/nylas";
import { getSessionRoute } from "@/libs/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");

  if (!code) {
    return NextResponse.json("No authorization code returned from Nylas", {
      status: 400,
    });
  }

  const response = await nylas.auth.exchangeCodeForToken({
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId as string,
    redirectUri: nylasConfig.callbackUri,
    code,
  });

  const { grantId, email } = response;

  await mongoose.connect(process.env.MONGODB_URI as string);

  const profileDoc = await ProfileModel.findOne({ email });
  if (profileDoc) {
    profileDoc.grantId = grantId;
    await profileDoc.save();
  } else {
    await ProfileModel.create({ email, grantId });
  }

  // Ustaw sesję
  const res = NextResponse.redirect(new URL("/dashboard", req.url));
  const userSession = await getSessionRoute(req, res);
  userSession.email = email;
  userSession.grantId = grantId;
  await userSession.save();

  return res;
}
