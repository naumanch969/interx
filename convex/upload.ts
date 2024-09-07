import { mutation } from './_generated/server'

export const generateUploadUrl = mutation(async (ctx) => {
    const url = await ctx.storage.generateUploadUrl()
    return url
})