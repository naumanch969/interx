import { useCreateMessage } from '@/features/messages/api/use-create-message'
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url'
import { useChannelId } from '@/hooks/use-channel-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Id } from '../../../../../../convex/_generated/dataModel'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

type CreateMessageValues = {
    channelId: Id<"channels">,
    workspaceId: Id<"workspaces">,
    body: string,
    image?: Id<"_storage"> | undefined
}

interface Props {
    placeholder: string
}

const ChatInput = ({ placeholder }: Props) => {

    const editorRef = useRef<Quill | null>(null)
    const { mutate } = useCreateMessage()
    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const { mutate: generateUploadUrl } = useGenerateUploadUrl()

    const [editorKey, setEditorKey] = useState(0)
    const [pending, setPending] = useState(false)

    const onSubmit = async ({ body, image }: { body: string, image: File | null }) => {
        try {
            setPending(true)
            editorRef?.current?.enable(false)

            const values: CreateMessageValues = {
                workspaceId, channelId, body, image: undefined
            }

            if (image) {
                var url: string | null = null
                await generateUploadUrl({}, {
                    throwError: true,
                    onSuccess(data) {
                        url = data
                        return data
                    }
                })
                if (!url) throw new Error("Url not found")

                const result = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': image.type },
                    body: image
                })
                if (!result.ok) throw new Error("Failed to upload image")
                const { storageId } = await result.json()
                values.image = storageId
            }


            await mutate(values, { throwError: true })
            setEditorKey(pre => pre + 1)
        }
        catch (err) {
            toast.error("Failed to send message")
        }
        finally {
            editorRef?.current?.enable(true)
            setPending(false)
        }
    }

    return (
        <div className='px-5 w-full' >

            <Editor
                key={editorKey} // on change of editorKey state, Editor componnet will rerender, forcing the state to be reset
                onSubmit={onSubmit}
                defaultValue={[]}
                disabled={pending}
                innerRef={editorRef}
                placeholder={placeholder}
                onCancel={() => { }}
            />

        </div>
    )
}

export default ChatInput