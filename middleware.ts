import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;
        const path = req.nextUrl.pathname;
        const userRole = token?.role as string;

        // Redirect if trying to access admin pages without ADMIN role
        if (path.startsWith("/admin") && userRole !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }

        // Redirect if trying to access vendor pages without VENDOR role
        if (path.startsWith("/vendor") && userRole !== "VENDOR") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token,
        },
        secret: process.env.NEXTAUTH_SECRET,
    }
);

export const config = {
    matcher: ["/admin/:path*", "/vendor/:path*", "/profile/:path*"],
};
