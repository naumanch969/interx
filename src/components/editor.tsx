import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Quill, { QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import { PiTextAa } from 'react-icons/pi'
import { MdSend } from 'react-icons/md'
import { ImageIcon, Smile } from 'lucide-react'
import Hint from './hint'
import { StringDecoder } from 'string_decoder'
import { Delta, Op } from 'quill/core'
import { cn } from '@/lib/utils'

type EditorValue = { image: File | null, body: string }

interface Props {
    variant?: 'create' | 'update',
    onSubmit: ({ image, body }: EditorValue) => void,
    onCancel?: () => void,
    placeholder?: string
    defaultValue?: Delta | Op[]
    disabled?: boolean
    innerRef?: RefObject<Quill | null>
}

const Editor = ({
    variant = 'create',
    onSubmit,
    defaultValue = [],
    disabled = false,
    innerRef,
    onCancel,
    placeholder = 'Write something'
}: Props) => {

    const [text, setText] = useState('')
    const [isToolbarVisible, setIsToolbarVisible] = useState(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)

    useLayoutEffect(() => {
        submitRef.current = onSubmit
        placeholderRef.current = placeholder
        defaultValueRef.current = defaultValue
        disabledRef.current = disabled
    })

    useEffect(() => {
        if (!containerRef.current) return

        const container = containerRef.current
        const editorContainer = container.appendChild(
            container.ownerDocument.createElement('div')
        )

        const options: QuillOptions = {
            theme: 'snow',
            placeholder: placeholderRef.current,
            modules: {
                toolbar: [
                    ["bold", "italic", "strke"],
                    ["link"],
                    [{ list: "ordered" }, { list: "bullet" }]
                ],
                keyboard: {
                    bindings: {
                        enter: {
                            key: "Enter",
                            handler: () => {
                                // TODO: submit form
                                return
                            }
                        },
                        shift_enter: {
                            key: "Enter",
                            shiftKey: true,
                            handler: () => {
                                quill.insertText(quill.getSelection()?.index || 0, '\n')
                            }
                        }
                    }
                }
            }
        }

        const quill = new Quill(editorContainer, options)
        quillRef.current = quill
        quillRef.current.focus()

        if (innerRef)
            (innerRef as React.MutableRefObject<Quill | null>).current = quill


        quill.setContents(defaultValueRef.current)
        setText(quill.getText())

        quill.on(Quill.events.TEXT_CHANGE, () => {
            setText(quill.getText())
        })

        return () => {
            quill.off(Quill.events.TEXT_CHANGE)
            if (container)
                container.innerHTML = ''
            if (quillRef.current)
                quillRef.current = null
            if (innerRef?.current)
                (innerRef as React.MutableRefObject<Quill | null>).current = null
        }

    }, [innerRef])

    const toggleToolbar = () => {
        setIsToolbarVisible(pre => !pre)
        const toolbarElement = containerRef?.current?.querySelector('.ql-toolbar')
        if (toolbarElement)
            toolbarElement.classList.toggle('hidden')
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length == 0

    return (
        <div className='flex flex-col' >

            <div className="flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white">
                <div className='h-full ql-custom' ref={containerRef} />
                <div className="flex px-2 pb-2 z-[5]">
                    <Hint label={isToolbarVisible ? 'Hide formatting' : 'Show Formatting'}  >
                        <Button
                            disabled={disabled}
                            size='sm'
                            variant='ghost'
                            onClick={toggleToolbar}
                        >
                            <PiTextAa className='size-4' />
                        </Button>
                    </Hint>
                    <Hint label='Emoji' >
                        <Button
                            disabled={disabled}
                            size='sm'
                            variant='ghost'
                            onClick={() => { }}
                        >
                            <Smile className='size-4' />
                        </Button>
                    </Hint>
                    {
                        variant == 'create' &&
                        <Hint label='Image' >
                            <Button
                                disabled={disabled}
                                size='sm'
                                variant='ghost'
                                onClick={() => { }}
                            >
                                <ImageIcon className='size-4' />
                            </Button>
                        </Hint>
                    }
                    {
                        variant == 'update' &&
                        <div className='ml-auto flex items-center gap-x-2'>
                            <Button
                                variant='outline'
                                size='sm'
                                onClick={() => { }}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='sm'
                                onClick={() => { }}
                                disabled={disabled || isEmpty}
                                className='bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
                            >
                                Save
                            </Button>
                        </div>
                    }
                    {
                        variant == 'create' &&
                        <Button
                            disabled={disabled || isEmpty}
                            onClick={() => { }}
                            size='iconSm'
                            className={cn('ml-auto', isEmpty ? 'bg-white hover:bg-white/80 text-muted-foreground' : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white')}
                        >
                            <MdSend className='size-4' />
                        </Button>
                    }
                </div>

                <div className="p-2 text-[10px] text-muted-foreground flex justify-end">
                    <p className="">
                        <strong>Shift + Return</strong> to add a new line
                    </p>
                </div>

            </div>

        </div>
    )
}

export default Editor