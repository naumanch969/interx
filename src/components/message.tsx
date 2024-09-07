import React from 'react'
import { Doc, Id } from '../../convex/_generated/dataModel'
import dynamic from 'next/dynamic'
import { format, isToday, isYesterday } from 'date-fns'
import Hint from './hint'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import Thumbnail from './thumbnail'
import Toolbar from './toolbar'
import { useUpdateMessage } from '@/features/messages/api/use-update-message'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { MdOutlineUpdate } from 'react-icons/md'
import { useRemoveMessage } from '@/features/messages/api/use-delete-message'
import { useConfirm } from '@/hooks/use-confirm'
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction'
import Reactions from './reactions'

const Renderer = dynamic(() => import("@/components/renderer"), { ssr: false })
const Editor = dynamic(() => import("@/components/editor"), { ssr: false })

interface Props {
    id: Id<"messages">
    memberId: Id<"members">
    authorImage?: string
    authorName: string
    reactions: Array<Omit<Doc<"reactions">, "memberId"> & { count: number, memberIds: Id<"members">[] }>
    body: Doc<"messages">["body"]
    updatedAt: Doc<"messages">["updatedAt"]
    createdAt: Doc<"messages">["_creationTime"]
    image: string | undefined | null,
    isEditing: boolean
    setEditingId: (id: Id<"messages"> | null) => void
    isCompact?: boolean
    hideThreadButton?: boolean
    threadCount?: number
    threadImage?: string
    threadTimestamp?: number
    isAuthor: boolean
}

const Message = ({
    authorName = 'Member',
    body,
    createdAt,
    id,
    image,
    isAuthor,
    isEditing,
    memberId,
    reactions,
    setEditingId,
    updatedAt,
    authorImage,
    hideThreadButton,
    isCompact,
    threadCount,
    threadImage,
    threadTimestamp,
}: Props) => {


    const [ConfirmDialog, confirm] = useConfirm("Delete message", "Are you sure you want to delete this message? This cannot be undone.")

    const { mutate: updateMessage, isPending: isUpdatingMessage } = useUpdateMessage()
    const { mutate: removeMessage, isPending: isRemovingMessage } = useRemoveMessage()
    const { mutate: toggleReaction, isPending: isTogglingReaction } = useToggleReaction()


    const isPending = isUpdatingMessage

    const formatFullTime = (date: Date) => {
        return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`
    }

    const onUpdate = ({ body }: { body: string }) => {
        updateMessage(
            { id, body },
            {
                onSuccess() {
                    toast.success('Message updated')
                    setEditingId(null)
                },
                onError() {
                    toast.error("Failed to update message")
                }
            }
        )
    }
    const onDelete = async () => {

        const ok = await confirm()
        if (!ok) return

        removeMessage(
            { id },
            {
                onSuccess() {
                    toast.success('Message deleted')
                    // TODO: close thread if open
                },
                onError() {
                    toast.error("Failed to delete message")
                }
            }
        )
    }
    const onReaction = (value: string) => {
        toggleReaction(
            { messageId: id, value },
            {
                onError() {
                    toast.error("Failed to toggle reaction")
                }
            })
    }


    if (isCompact)
        return (
            <>
                <ConfirmDialog />
                <div className={cn(
                    'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
                    isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
                    isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
                )} >
                    <div className="flex items-start gap-2">
                        <Hint label={formatFullTime(new Date(createdAt))} >
                            <button className='text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline' >
                                {format(new Date(createdAt), 'hh:mm')}
                            </button>
                        </Hint>
                        {
                            isEditing
                                ?
                                <div className='w-full h-full' >
                                    <Editor
                                        onSubmit={onUpdate}
                                        disabled={isPending}
                                        defaultValue={JSON.parse(body)}
                                        onCancel={() => setEditingId(null)}
                                        variant='update'
                                    />
                                </div>
                                :
                                <div className="flex flex-col w-full">
                                    <Renderer value={body} />
                                    <Thumbnail url={image} />
                                    {updatedAt && <span className='text-xs text-muted-foreground' >edited</span>}
                                    <Reactions data={reactions} onChange={onReaction} />
                                </div>
                        }
                    </div>

                    {
                        !isEditing &&
                        <Toolbar
                            isAuthor={isAuthor}
                            isPending={isPending}
                            handleEdit={() => setEditingId(id)}
                            handleThread={() => { }}
                            handleDelete={onDelete}
                            handleReaction={onReaction}
                            hideThreadButton={hideThreadButton}
                        />
                    }

                </div>
            </>
        )

    return (
        <>
            <ConfirmDialog />
            <div className={cn(
                'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
                isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
                isRemovingMessage && 'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
            )} >
                <div className="flex items-start gap-2">
                    <button>
                        <Avatar>
                            <AvatarImage src={authorImage} alt={authorName} />
                            <AvatarFallback>
                                {authorName?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                    </button>
                    {
                        isEditing
                            ?
                            <div className='w-full h-full' >
                                <Editor
                                    onSubmit={onUpdate}
                                    disabled={isPending}
                                    defaultValue={JSON.parse(body)}
                                    onCancel={() => setEditingId(null)}
                                    variant='update'
                                />
                            </div>
                            :
                            <div className="flex flex-col w-full overflow-hidden ">
                                <div className="text-sm">
                                    <button onClick={() => { }} className='font-bold text-primary hover:underline' >{authorName}</button>
                                    <span className="">&nbsp;&nbsp;</span>
                                    <Hint label={formatFullTime(new Date(createdAt))} >
                                        <button className='text-xs text-muted-foreground hover:underline' >
                                            {format(new Date(createdAt), 'h:mm a')}
                                        </button>
                                    </Hint>
                                </div>
                                <Renderer value={body} />
                                <Thumbnail url={image} />
                                {updatedAt && <span className='text-xs text-muted-foreground' >edited</span>}
                                <Reactions data={reactions} onChange={onReaction} />
                            </div>
                    }
                </div>

                {
                    !isEditing &&
                    <Toolbar
                        isAuthor={isAuthor}
                        isPending={isPending}
                        handleEdit={() => setEditingId(id)}
                        handleThread={() => { }}
                        handleDelete={onDelete}
                        handleReaction={onReaction}
                        hideThreadButton={hideThreadButton}
                    />
                }

            </div>
        </>
    )

}

export default Message