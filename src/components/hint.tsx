import React, { ReactNode } from 'react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface Props {
    label: string,
    children: ReactNode,
    side?: 'top' | 'right' | 'bottom' | 'left',
    align?: 'start' | 'center' | 'end'
}

const Hint = ({ children, label, align, side }: Props) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={50} >
                <TooltipTrigger asChild >{children}</TooltipTrigger>
                <TooltipContent side={side} align={align} className='bg-black text-white border border-white/5' >
                    <p className="font-medium text-xs">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

export default Hint