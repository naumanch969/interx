import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { IconType } from 'react-icons/lib'

interface Props {
    icon: LucideIcon | IconType,
    label: string,
    link: string
}

const SidebarButton = ({ icon: Icon, label, link }: Props) => {

    const pathname = usePathname()

    const isActive = pathname.includes(link)

    return (
        <Link href={link} className='group flex flex-col items-center justify-center gap-y-0.5 cursor-pointer' >
            <Button
                variant='transparent'
                className={cn('size-9 p-2 group-hover:bg-accent/20', isActive && 'bg-accent/20')}
            >
                <Icon className='size-5 text-white group-hover:scale-110 transition-all' />
            </Button>
            <span className="text-[11px] text-white group-hover:text-accent ">
                {label}
            </span>
        </Link>
    )
}

export default SidebarButton