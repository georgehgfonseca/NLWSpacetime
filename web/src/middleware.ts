import { NextRequest, NextResponse } from "next/server";

const signinUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`;

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  if (!token) {
    // Forward user to login
    return NextResponse.redirect(signinUrl, {
      headers: {
        "Set-Cookie": `redirectTo=${
          request.url
        }; Path=/; HttpOnly; max-age=${20}`,
      },
    });
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/memories/:path*",
};
