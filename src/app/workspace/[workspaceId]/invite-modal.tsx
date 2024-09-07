import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useNewJoinCode } from '@/features/workspaces/api/use-new-join-code'
import { useConfirm } from '@/hooks/use-confirm'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { Copy, RefreshCcw } from 'lucide-react'
import { toast } from 'sonner'

interface Props {
    open: boolean
    setOpen: (open: boolean) => void
    name: string
    joinCode: string
}

const InviteModal = ({ open, setOpen, name, joinCode }: Props) => {

    const workspaceId = useWorkspaceId()
    const [ConfirmDialog, confirm] = useConfirm("Are you sure?", "This will deactivate the current invite code and generate a new one.")

    const { mutate, isPending } = useNewJoinCode()

    const onCopy = () => {
        const inviteLink = `${window.location.origin}/join/${workspaceId}`
        navigator.clipboard
            .writeText(inviteLink)
            .then(() => {
                toast.success('Invite link copied to clipboard')
            })
    }

    const onNewCode = async () => {

        const ok = await confirm()
        if (!ok) return

        mutate(
            { workspaceId },
            {
                onSuccess() {
                    toast.success('New code generated')
                },
                onError() {
                    toast.error('Failed to regenerate invite code')
                }
            }
        )
    }

    return (
        <>
            <ConfirmDialog />

            <Dialog open={open} onOpenChange={setOpen} >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Invite people to {name}</DialogTitle>
                        <DialogDescription>Use the code below to invite people to your workspace</DialogDescription>
                    </DialogHeader>
                    <div className='flex flex-col gap-y-4 items-center justify-center py-10' >
                        <p className="text-4xl font-bold tracking-widest uppercase ">{joinCode}</p>
                        <Button onClick={onCopy} variant='ghost' size='sm' >
                            Copy link
                            <Copy className='size-4 ml-2' />
                        </Button>
                    </div>
                    <div className="flex items-center justify-between w-full">
                        <Button disabled={isPending} onClick={onNewCode} variant='outline' >
                            New Code <RefreshCcw className='size-4 ml-2' />
                        </Button>
                        <DialogClose asChild >
                            <Button>Close</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default InviteModal