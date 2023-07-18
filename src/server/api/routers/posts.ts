import { AuthConfig } from "@clerk/clerk-js/dist/types/core/resources/AuthConfig";
import { clerkClient } from "@clerk/nextjs";

import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.post.findMany({ take: 100 });
  }),
});
