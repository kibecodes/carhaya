import { auth } from "@/auth";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_LOGIN_REDIRECT,
  roleBasedRoutes,
} from "@/routes";
import { getToken } from "next-auth/jwt";

type UserRole = keyof typeof roleBasedRoutes;

export default auth(async (req) => {
  const { nextUrl } = req;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isLoggedIn = !!token;
  let userRole: UserRole | null = null;

  if (token && token.role) {
    userRole = token.role.toLowerCase() as UserRole;
  }

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoutes = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoutes = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  // Redirect logged-in users away from auth routes (login/register) to homepage
  if (isAuthRoutes) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  // Redirect users to login if not logged in and trying to access a non-public route
  if (!isLoggedIn && !isPublicRoutes) {
    return Response.redirect(new URL("/login", nextUrl));
  }

  // Role-based access control for protected routes
  if (userRole) {
    const roleRoutes = roleBasedRoutes[userRole] || [];

    // Check if the current pathname starts with any of the allowed role routes
    const isRoleAllowed = roleRoutes.some((route) =>
      nextUrl.pathname.startsWith(route)
    );

    if (!isRoleAllowed) {
      // If the user role isn't allowed, redirect to unauthorized or another route
      return Response.redirect(new URL("/unauthorized", nextUrl));
    }
  }

  return null;
});

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
