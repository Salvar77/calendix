import { NextRequest, NextResponse } from "next/server";
import { nylas, nylasConfig } from "@/libs/nylas";
import { session } from "@/libs/session";
import { ProfileModel } from "@/models/Profile";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  // 1. Pobranie code z query
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) {
    return new Response("No authorization code returned from Nylas", {
      status: 400,
    });
  }

  // 2. Wymiana code na token
  const { grantId, email } = await nylas.auth.exchangeCodeForToken({
    clientSecret: nylasConfig.apiKey,
    clientId: nylasConfig.clientId!,
    redirectUri: nylasConfig.callbackUri,
    code,
  });

  // 3. Zapis do bazy
  await mongoose.connect(process.env.MONGODB_URI as string);
  const profileDoc = await ProfileModel.findOne({ email });
  if (profileDoc) {
    profileDoc.grantId = grantId;
    await profileDoc.save();
  } else {
    await ProfileModel.create({ email, grantId });
  }

  // 4. Pobierz sesję, ustaw w niej dane
  const s = await session(req);
  s.set("email", email);
  s.set("grantId", grantId);

  // 5. Zapisz (commit) zmiany w sesji – to ustawia Set-Cookie w odpowiedzi
  await s.commit();

  // 6. Przekieruj na /dashboard
  return NextResponse.redirect("/dashboard");
}
