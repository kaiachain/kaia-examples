import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_FILE = /\.(.*)$/;

const supportedLocales = ["en", "ko", "ja", "zh-TW", "th"];

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (PUBLIC_FILE.test(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const locale = supportedLocales.find((locale) =>
    pathname.startsWith(`/${locale}`)
  );
  if (locale) {
    return NextResponse.next();
  }

  const acceptLanguage = request.headers.get("accept-language") || "en";
  const defaultLocale = acceptLanguage.split(",")[0]?.split("-")[0] || "en";

  const localeToUse = supportedLocales.includes(defaultLocale)
    ? defaultLocale
    : "en";

  return NextResponse.redirect(
    new URL(`/${localeToUse}${pathname}${search}`, request.url)
  );
}
