import { authMiddleware } from "@clerk/nextjs";

// See https://clerk.com/docs/references/nextjs/auth-middleware
// for more information about configuring your Middleware
export default authMiddleware({
  // Allow signed out users to access the specified routes:
  publicRoutes: ["/", "/auth-callback", "/sign-in", "/sign-up"],
});

export const config = {
  matcher: [
    "/",
    "/sign-in",
    "/sign-up",
    "/dashboard/:path*",
    "/api/auth-callback",
    "/api/deleteFile",
    "/api/getFile",
    "/api/getFileMessages",
    "/api/getUserFiles",
    "/api/message",
    "/api/uploadthing",
    "/api/getFileUploadStatus",
  ],
};
