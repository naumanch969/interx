import React from 'react'
import { Dialog, DialogHeader, DialogTrigger, DialogContent } from './ui/dialog'
import { X } from 'lucide-react'

interface Props {
    url: string | null | undefined
}

const Thumbnail = ({ url }: Props) => {

    if (!url) return null
    

    return (
        <Dialog>
            <DialogTrigger>
                <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in ">
                    <img src={url} alt="Message image" className='rounded-md object-cover size-full' />
                </div>
            </DialogTrigger>
            <DialogContent className='max-w-[800px] border-none bg-transparent p-0 shadow-none ' >
                <img src={url} alt="Message image" className='rounded-md object-cover size-full' />
            </DialogContent>
        </Dialog>
    )
}

export default Thumbnail