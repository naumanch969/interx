import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCreateWorkspaceModal } from '../store/use-create-workspace-modal'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCreateWorkspace } from '../api/use-create-workspace'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const CreateWorkspaceModal = () => {

    const router = useRouter()
    const { mutate, isPending } = useCreateWorkspace()
    const [open, setOpen] = useCreateWorkspaceModal()

    const [name, setName] = useState("")
 
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        mutate({ name }, {
            onSuccess(id) {
                toast.success('Workspace created')
                router.push(`/workspace/${id}`)
                onClose()
            },
        })
    }

    const onClose = () => {
        setOpen(false)
        setName('')
    }

    return (
        <Dialog open={open} onOpenChange={onClose} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a workspace</DialogTitle>
                </DialogHeader>
                <form onSubmit={onSubmit} className='space-y-4' >
                    <Input
                        disabled={isPending}
                        value={name}
                        required={true}
                        autoFocus
                        onChange={e => setName(e.target.value)}
                        minLength={3}
                        placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
                    />
                    <div className="flex justify-end">
                        <Button disabled={isPending} >Create</Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateWorkspaceModal