import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import React, { useState } from 'react'


export const useConfirm = (title: string, message: string): [() => JSX.Element, () => Promise<unknown>] => {

    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const confirm = () => new Promise((resolve, reject) => {
        setPromise({ resolve })
    })

    const onClose = () => {
        setPromise(null)
    }

    const onCancel = () => {
        promise?.resolve(false)
        onClose()
    }

    const onConfirm = () => {
        promise?.resolve(true)
        onClose()
    }

    const ConfirmDialog = () => (
        <Dialog open={promise !== null} onOpenChange={onCancel} >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{message}</DialogDescription>
                </DialogHeader>
                <DialogFooter className='pt-2'>
                    <Button variant='outline' onClick={onCancel}>Cancel</Button>
                    <Button onClick={onConfirm}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )

    return [ConfirmDialog, confirm]
}