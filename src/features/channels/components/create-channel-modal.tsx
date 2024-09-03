import React, { ChangeEvent, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateChannelModal } from '../store/use-create-channel-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateChannel } from '../api/use-create-channel'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const CreateChannelModal = () => {

    const router = useRouter()
    const workspaceId = useWorkspaceId()
    const { mutate, isPending } = useCreateChannel()
    const [open, setOpen] = useCreateChannelModal()

    const [name, setName] = useState("")

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutate({ name, workspaceId }, {
            onSuccess(id) {
                toast.success('Channel created')
                router.push(`/workspace/${workspaceId}/channel/${id}`)
                onClose()
            },
        })
    }

    const onChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\s+/g, "-").toLowerCase()
        setName(value)
    }

    const onClose = () => {
        setOpen(false)
        setName('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a channel</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className='space-y-4' >
                    <Input
                        disabled={isPending}
                        value={name}
                        required={true}
                        autoFocus
                        onChange={onChange}
                        minLength={3}
                        maxLength={80}
                        placeholder="e.g. plan-budget"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} >Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateChannelModal