import { AuthConfig } from "@clerk/clerk-js/dist/types/core/resources/AuthConfig";
import { clerkClient } from "@clerk/nextjs";

import type { User } from "@clerk/nextjs/dist/types/server";
import { TRPCError } from "@trpc/server";

import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

import { Ratelimit } from "@upstash/ratelimit"; // for deno: see above
import { Redis } from "@upstash/redis";

export const profileRouter = createTRPCRouter({});
