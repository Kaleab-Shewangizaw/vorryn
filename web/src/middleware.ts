import { NextRequest, NextResponse } from "next/server";

// Routes that require an active session
const PROTECTED = ["/dashboard", "/app"];

// Routes that should redirect to /dashboard when already authenticated
const REDIRECT_IF_AUTHED = ["/auth", "/onboarding"];

function hasSession(request: NextRequest): boolean {
  // Better Auth sets one of these cookies depending on whether the connection
  // is HTTPS (production) or HTTP (development)
  return !!(
    request.cookies.get("__Secure-better-auth.session_token")?.value ||
    request.cookies.get("better-auth.session_token")?.value
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = hasSession(request);

  const isProtected = PROTECTED.some((p) => pathname.startsWith(p));
  const isRedirectable = REDIRECT_IF_AUTHED.some((p) =>
    pathname.startsWith(p)
  );

  if (isProtected && !authed) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (isRedirectable && authed) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/app/:path*",
    "/auth/:path*",
    "/onboarding",
  ],
};
