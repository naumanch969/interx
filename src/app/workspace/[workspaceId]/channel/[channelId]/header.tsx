import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel'
import { useUpdateChannel } from '@/features/channels/api/use-update-channel'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useChannelId } from '@/hooks/use-channel-id'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { cn } from '@/lib/utils'
import { Trash } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { ChangeEvent, FormEvent, useState } from 'react'
import { FaChevronDown } from 'react-icons/fa'
import { toast } from 'sonner'

interface Props {
    title: string
}

const Header = ({ title }: Props) => {

    const channelId = useChannelId()
    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "You are about to delete this channel. This action is irreversable.")

    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [value, setValue] = useState(title)

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
    const { mutate: updateChannel, isPending: isUpdatingChannel } = useUpdateChannel()
    const { mutate: removeChannel, isPending: isRemovingChannel } = useRemoveChannel()

    const onOpenEditDialog = (value: boolean) => {
        if (member?.role != 'admin') return
        setEditOpen(value)
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setValue(v)
    }

    const onEdit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        updateChannel(
            { id: channelId, name: value },
            {
                onSuccess() {
                    setEditOpen(false)
                    toast.success('Channel udpated')
                },
                onError() {
                    toast.error('Failed to update channel')
                }
            }
        )
    }

    const onRemove = async () => {

        const ok = await confirm()
        if (!ok) return

        removeChannel(
            { id: channelId },
            {
                onSuccess() {
                    toast.success('Channel removed')
                    router.replace(`/workspace/${workspaceId}`)
                },
                onError() {
                    toast.error('Failed to remove channel')
                }
            }
        )
    }


    return (
        <>
            <ConfirmDialog />

            <div className='bg-white border-b h-[49px] flex items-center px-4 overflow-hidden ' >
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant='ghost' className='text-lg font-semibold px-2 overflow-hidden w-auto' >
                            <span className="truncate"># {title}</span>
                            <FaChevronDown className='size-2.5 ml-2 ' />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className='p-0 bg-gray-50 overflow-hidden' >
                        <DialogHeader className='p-4 border-b bg-white' >
                            <DialogTitle># {title}</DialogTitle>
                        </DialogHeader>
                        <div className="px-4 pb-4 flex flex-col gap-y-2">

                            <Dialog open={editOpen} onOpenChange={onOpenEditDialog} >
                                <DialogTrigger asChild >
                                    <div className={cn("px-5 py-4 bg-white rounded-lg border hover:bg-gray-50", member?.role == 'admin' && 'cursor-pointer')}>
                                        <div className="flex items-center justify-between">
                                            <p className="text-sm font-semibold">Channel name</p>
                                            {member?.role == 'admin' && <p className="text-sm text-[#1264a3] hover:underline font-semibold">Edit</p>}
                                        </div>
                                        <p className="tetx-sm"># {title}</p>
                                    </div>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Rename this channel</DialogTitle>
                                        <form onSubmit={onEdit} className='space-y-4' >
                                            <Input
                                                value={value}
                                                disabled={isUpdatingChannel}
                                                onChange={onChange}
                                                required
                                                autoFocus
                                                minLength={3}
                                                maxLength={80}
                                                placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                                            />
                                            <DialogFooter>
                                                <DialogClose asChild>
                                                    <Button variant='outline' disabled={isUpdatingChannel} >Cancel</Button>
                                                </DialogClose>
                                                <Button disabled={isUpdatingChannel} >Save</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                            {
                                member?.role == 'admin' &&
                                <Button
                                    disabled={isRemovingChannel}
                                    onClick={onRemove}
                                    className='flex items-cnter gap-x-2 px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50 text-rose-600'
                                >
                                    <Trash className='size-4' />
                                    <p className="text-sm font-semibold">Delete channel</p>
                                </Button>
                            }
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </>
    )
}

export default Header