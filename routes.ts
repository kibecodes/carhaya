/**
 * Array routes accessible to the public.
 * These routes do not require authentication
 * @type {string[]}
 */

export const publicRoutes = [
  "/login",
  "/register",
  "/change-password",
  "/unauthorized",
  "/error",
];

/**
 * Array routes used for authentication.
 * This will redirect users to homepage
 * @type {string[]}
 */
export const authRoutes = [
  "/login",
  "/register",
  "/error",
  "/reset",
  "/new-password",
];

/**
 * Routes accessible to only certain roles.
 * The key is the role and the value is an array of routes.
 */
export const roleBasedRoutes = {
  admin: [
    "/",
    "/dashboard/analytics",
    "/dashboard/reports",
    "/dashboard/notifications",
    "/dashboard/protrack",
    "/pages/renters",
    "/pages/customers",
    "/pages/vehicles",
    "/bookings",
    "/upload/fleet",
    "/upload/users",
    "/upload/vehicles",
    "/roles",
    "/settings/profile",
    "/settings/account",
  ],
  user: [
    "/upload/vehicle",
    "/upload/users",
    "/settings/profile",
    "/settings/account",
  ],
};

/**
 * Prefix for API authentication routes.
 * Routes starting with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
