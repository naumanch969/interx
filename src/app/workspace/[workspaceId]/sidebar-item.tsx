import React from 'react'
import { LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import Hint from '@/components/hint';


const sidebarItemVariants = cva(
    'flex items-center justify-start gap-1.5 font-normal h-7 px-[18px] text-sm overflow-hidden',
    {
        variants: {
            variant: {
                default: 'text-[#f9edffcc]',
                active: 'text-[#481349] bg-white/90 hover:bg-white/90',
            }
        },
        defaultVariants: {
            variant: 'default'
        }
    }
)

interface Props {
    label: string,
    icon: LucideIcon | IconType
    variant?: VariantProps<typeof sidebarItemVariants>["variant"],
    link: string,
    role?: 'admin' | 'member'
}

const SidebarItem = ({ icon: Icon, label, variant, role, link }: Props) => {

    return (
        <Button variant='transparent' size='sm' asChild className={cn('flex justify-between items-center', sidebarItemVariants({ variant }))} >
            <Link href={link} shallow={true} >
                <Icon className='size-3.5 mr-1 shrink-0 ' />
                <span className="text-sm truncate">{label}</span>
            </Link>
        </Button>
    )
}

export default SidebarItem