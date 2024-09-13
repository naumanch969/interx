import { LoaderIcon } from 'lucide-react'
import React from 'react'

const Loader = () => {
    return (
        <div className='h-full flex-1 flex items-center justify-center flex-col gap-2 ' >
            <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
        </div>
    )
}

export default Loader