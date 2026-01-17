import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    externalId: v.string(),
    email: v.string(),
    avatarUrl: v.optional(v.string()),
    
    // User tier for access control
    tier: v.union(
      v.literal("General"),
      v.literal("Medical"),
      v.literal("Business")
    ),
    
    // Onboarding status
    hasCompletedOnboarding: v.boolean(),

    // User's preferred language (e.g., 'en-US', 'tr', 'ja')
    language: v.optional(v.string()),
    
    // Additional user information collected during onboarding
    // Add fields as needed, e.g.:
    // bio: v.optional(v.string()),
    // phoneNumber: v.optional(v.string()),
    // location: v.optional(v.string()),
  })
    .index("byExternalId", ["externalId"])
    .index("byTier", ["tier"]),
});