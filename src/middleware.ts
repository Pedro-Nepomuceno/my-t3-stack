import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware();
console.log("running");

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
