import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { email, otpCode } = await req.json();

  if (!email || !otpCode) {
    return NextResponse.json({ error: "Missing email or OTP" }, { status: 400 });
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Authorization": `re_fpv85D9N_6df28MsQPhQCEKQLse2MdeLY`, // 🔹 Replace with your API key
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: 'sykeszs.github.io',
      to: email,
      subject: "Your OTP Code",
      text: `Your verification code is: ${otpCode}. It expires in 5 minutes.`,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }

  return NextResponse.json({ message: "OTP sent successfully" });
}
