import { NextResponse, NextRequest } from "next/server";
import { JWT } from "./lib/auth";

const protectedPaths = ["/dashboard", "/profile"];

export const middleware = async (request: NextRequest) => {
  try {
    const path = request.nextUrl.pathname;
    if (!protectedPaths.some((p) => path.startsWith(p)))
      return NextResponse.next();

    const token = request.cookies.get("auth-token")?.value;
    if (!token) return NextResponse.redirect(new URL("/login", request.url));

    const payload = await JWT.verify(token);
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));

    return NextResponse.next();
  } catch (error) {
    console.error(error);
    return NextResponse.redirect(new URL("/login", request.url));
  }
};
