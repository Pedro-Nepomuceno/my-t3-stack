import { clerkClient } from "@clerk/nextjs";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({ take: 100 });

    const users = await clerkClient.users.getUserList({
      userId: posts.map((post) => post.authorId),
      limit: 100,
    });

    return posts;
  }),
});
