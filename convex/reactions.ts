import { v } from 'convex/values'
import { mutation, query, QueryCtx } from './_generated/server'
import { auth } from './auth'
import { Doc, Id } from './_generated/dataModel'

const getMember = async (ctx: QueryCtx, workspaceId: Id<"workspaces">, userId: Id<"users">) => {
    return await ctx.db
        .query("members")
        .withIndex("by_workspace_id_user_id", q => q.eq("userId", userId).eq("workspaceId", workspaceId))
        .unique()
}

export const toggle = mutation({
    args: {
        messageId: v.id("messages"),
        value: v.string()
    },
    handler: async (ctx, args) => {
        const userId = await auth.getUserId(ctx)
        if (!userId) throw new Error("Unauthorized")

        const message = await ctx.db.get(args.messageId)
        if (!message) throw new Error("Message not found")

        const member = await getMember(ctx, message.workspaceId, userId)
        if (!member) throw new Error("Member not found")

        const existingMessageReaction = await ctx.db
            .query("reactions")
            .filter(q => q.and(
                q.eq(q.field("messageId"), args.messageId),
                q.eq(q.field("memberId"), member._id),
                q.eq(q.field("value"), args.value),
            ))
            .first()

        if (existingMessageReaction) {
            await ctx.db.delete(existingMessageReaction._id)
            return existingMessageReaction._id
        }
        else {
            const reactionId = await ctx.db.insert("reactions", {
                value: args.value,
                memberId: member._id,
                messageId: message._id,
                workspaceId: member.workspaceId
            })
            return reactionId
        }

    }
})