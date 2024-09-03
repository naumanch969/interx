import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useWorkspaceId } from '@/hooks/use-workspace-id'

const userItemVariants = cva(
    'flex items-center justify-start gap-1.5 font-normal h-7 px-4 text-sm overflow-hidden',
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
    id: Id<"members">,
    label?: string,
    image?: string,
    variant?: VariantProps<typeof userItemVariants>["variant"]
}

const UserItem = ({ id, image, label, variant }: Props) => {

    const workspaceId = useWorkspaceId()

    return (
        <Button variant='transparent' size='sm' asChild className={cn(userItemVariants({ variant }))} >
            <Link href={`/workspace/${workspaceId}/member/${id}`} >
                <Avatar className='size-5 rounded-md mr-1' >
                    <AvatarImage src={image} className='rounded-md' />
                    <AvatarFallback className='rounded-md shrink-0 bg-sky-500 text-white text-xs' >{label?.charAt(0)?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm truncate text-white">{label}</span>
            </Link>
        </Button>
    )
}

export default UserItem