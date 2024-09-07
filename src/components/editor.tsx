import React, { RefObject, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Quill, { QuillOptions } from 'quill'
import 'quill/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import { PiTextAa } from 'react-icons/pi'
import { MdSend } from 'react-icons/md'
import { ImageIcon, Smile, X } from 'lucide-react'
import Hint from './hint'
import { StringDecoder } from 'string_decoder'
import { Delta, Op } from 'quill/core'
import { cn } from '@/lib/utils'
import EmojiPopover from './emoji-popover'
import Image from 'next/image'

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
    const [image, setImage] = useState<File | null>(null)
    const [isToolbarVisible, setIsToolbarVisible] = useState(true)

    const containerRef = useRef<HTMLDivElement>(null)
    const submitRef = useRef(onSubmit)
    const placeholderRef = useRef(placeholder)
    const quillRef = useRef<Quill | null>(null)
    const defaultValueRef = useRef(defaultValue)
    const disabledRef = useRef(disabled)
    const imageElementRef = useRef<HTMLInputElement>(null)

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
                                const text = quill.getText()
                                const addedImage = imageElementRef.current?.files?.[0] || null
                                const isEmpty = !addedImage && text.replace(/<(.|\n)*?>/g, '').trim().length == 0
                                if (isEmpty) return
                                const body = JSON.stringify(quill.getContents())
                                submitRef.current?.({ image: addedImage, body })
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

    const onEmojiSelect = (emoji: any) => {
        const quill = quillRef.current

        quill?.insertText(quill?.getSelection()?.index || 0, emoji?.native)
    }

    const isEmpty = text.replace(/<(.|\n)*?>/g, '').trim().length == 0

    return (
        <div className='flex flex-col' >

            <input
                title='File'
                type='file'
                accept='image/*'
                ref={imageElementRef}
                onChange={(e) => setImage(e.target.files?.[0]!)}
                className='hidden'
            />

            <div className={cn(
                "flex flex-col border border-slate-200 rounded-md overflow-hidden focus-within:border-slate-300 focus-within:shadow-sm transition bg-white",
                disabled && 'opacity-50'
            )}>
                <div className='h-full ql-custom' ref={containerRef} />
                {
                    !!image &&
                    <div className='p-2' >
                        <div className="relative size-[62px] flex items-center justify-center group/image ">
                            <Hint label='Remove Image' >
                                <button
                                    title='Delete'
                                    onClick={() => {
                                        setImage(null)
                                        imageElementRef.current!.value = ''
                                    }}
                                    className='hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center'
                                >
                                    <X className='size-3.5' />
                                </button>
                            </Hint>
                            <Image
                                src={URL.createObjectURL(image)}
                                alt={image?.name}
                                layout='fill'
                                className='rounded-xl overflow-hidden border object-cover'
                            />
                        </div>
                    </div>
                }
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
                    <EmojiPopover onEmojiSelect={onEmojiSelect} >
                        <Button
                            disabled={disabled}
                            size='sm'
                            variant='ghost'
                        >
                            <Smile className='size-4' />
                        </Button>
                    </EmojiPopover>
                    {
                        variant == 'create' &&
                        <Hint label='Image' >
                            <Button
                                disabled={disabled}
                                size='sm'
                                variant='ghost'
                                onClick={() => imageElementRef.current?.click()}
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
                                onClick={onCancel}
                                disabled={disabled}
                            >
                                Cancel
                            </Button>
                            <Button
                                size='sm'
                                onClick={() => onSubmit({ image, body: JSON.stringify(quillRef.current?.getContents()) })}
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
                            onClick={() => onSubmit({ image, body: JSON.stringify(quillRef.current?.getContents()) })}
                            size='iconSm'
                            className={cn('ml-auto', isEmpty ? 'bg-white hover:bg-white/80 text-muted-foreground' : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white')}
                        >
                            <MdSend className='size-4' />
                        </Button>
                    }
                </div>
                {
                    variant == 'create' &&
                    <div className={cn("p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition",
                        !isEmpty && 'opacity-100'
                    )}>
                        <p className="">
                            <strong>Shift + Return</strong> to add a new line
                        </p>
                    </div>
                }

            </div>

        </div>
    )
}

export default Editor