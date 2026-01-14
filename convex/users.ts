// convex/users.ts
import { UserJSON } from "@clerk/backend";
import { v, Validator } from "convex/values";
import { internalMutation, mutation, query, QueryCtx } from "./_generated/server";

export const current = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const upsertFromClerk = internalMutation({
  args: { data: v.any() as Validator<UserJSON> }, // trust Clerk
  async handler(ctx, { data }) {
    const userAttributes = {
      name: `${data.first_name} ${data.last_name}`,
      externalId: data.id,
      email: data.email_addresses?.[0]?.email_address ?? "",
    };

    const user = await userByExternalId(ctx, data.id);
    if (user === null) {
      // New user - set defaults
      await ctx.db.insert("users", {
        ...userAttributes,
        tier: "General" as const,
        hasCompletedOnboarding: false,
      });
    } else {
      // Existing user - update basic info only, preserve tier, onboarding status, and avatarUrl
      await ctx.db.patch(user._id, userAttributes);
    }
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  async handler(ctx, { clerkUserId }) {
    const user = await userByExternalId(ctx, clerkUserId);
    if (user !== null) {
      await ctx.db.delete(user._id);
    } else {
      console.warn(
        `Can't delete user, there is none for Clerk user ID: ${clerkUserId}`,
      );
    }
  },
});

export const completeOnboarding = mutation({
  args: {
    tier: v.union(
      v.literal("General"),
      v.literal("Medical"),
      v.literal("Business")
    ),
  },
  async handler(ctx, { tier }) {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, {
      tier,
      hasCompletedOnboarding: true,
    });
  },
});

export const updateAvatar = mutation({
  args: { avatarUrl: v.string() },
  async handler(ctx, { avatarUrl }) {
    const user = await getCurrentUser(ctx);
    if (!user) {
      throw new Error("User not found");
    }
    
    await ctx.db.patch(user._id, { avatarUrl });
  },
});

export async function getCurrentUser(ctx: QueryCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (identity === null) return null;
  // identity.subject is the Clerk user ID when using webhooks pattern
  return await userByExternalId(ctx, identity.subject);
}

async function userByExternalId(ctx: QueryCtx, externalId: string) {
  return await ctx.db
    .query("users")
    .withIndex("byExternalId", (q) => q.eq("externalId", externalId))
    .unique();
}

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called storeUser without authentication present");
    }

    // identity.subject is Clerk user ID; reuse userByExternalId
    const user = await userByExternalId(ctx, identity.subject);
    if (user !== null) {
      // Optionally patch if name changed
      return user._id;
    }

    // Fallback: create if webhook hasn't run yet
    return await ctx.db.insert("users", {
        name: identity.name ?? "Anonymous",
        externalId: identity.subject,
        email: (identity.emailAddresses as Array<{ emailAddress: string; }>)?.[0]?.emailAddress ?? "",
        tier: "General",
        hasCompletedOnboarding: false
    });
  },
});

export const deleteCurrentUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called deleteCurrentUser without authentication present");
    }

    const user = await userByExternalId(ctx, identity.subject);
    
    // If user exists in Convex, delete them.
    // If not, simply return (idempotent delete).
    if (user !== null) {
      await ctx.db.delete(user._id);
    }
  },
});