import { AuthConfig } from "@clerk/clerk-js/dist/types/core/resources/AuthConfig";
import { clerkClient } from "@clerk/nextjs";

import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import {
  createTRPCRouter,
  privateProcedure,
  publicProcedure,
} from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

// Create a new ratelimiter, that allows 3 requests per 1 min
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(3, "1 m"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */
  prefix: "@upstash/ratelimit",
});

const filterUserForClient = (user: User) => {
  return {
    id: user.id,
    username: user.username,
    profilePicture: user.profileImageUrl,
  };
};

export const postsRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.prisma.post.findMany({
      take: 100,
      orderBy: [{ createdAt: "desc" }],
    });
    const users = (
      await clerkClient.users.getUserList({
        userId: posts.map((post) => post.authorId),
      })
    ).map(filterUserForClient);

    return posts.map((post) => {
      const author = users.find((user) => user.id === post.authorId);

      return {
        post,
        author,
      };
    });
  }),
  create: privateProcedure
    .input(z.object({ content: z.string().min(1).max(250) }))
    .mutation(async ({ ctx, input }) => {
      const authorId = ctx.userId;

      const { success } = await ratelimit.limit(authorId);

      if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS" });

      const post = await ctx.prisma.post.create({
        data: {
          authorId,
          content: input.content,
        },
      });
      return post;
    }),
});