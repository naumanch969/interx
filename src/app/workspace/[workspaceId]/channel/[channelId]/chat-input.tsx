import dynamic from 'next/dynamic'
import Quill from 'quill'
import React, { useRef } from 'react'

const Editor = dynamic(() => import('@/components/editor'), { ssr: false })

interface Props {
    placeholder: string
}

const ChatInput = ({ placeholder }: Props) => {

    const editorRef = useRef<Quill | null>(null)

    return (
        <div className='px-5 w-full' >

            <Editor
                onSubmit={() => { }}
                defaultValue={[]}
                disabled={false}
                innerRef={editorRef}
                placeholder={placeholder}
                onCancel={() => { }}
            />

        </div>
    )
}

export default ChatInput