"use client"

import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCurrentUser } from '../hooks/useCurrentUser'
import { Loader, LogOut } from 'lucide-react'
import { useAuthActions } from '@convex-dev/auth/react'

const UserButton = () => {

    const { signOut } = useAuthActions()
    const { data, isLoading } = useCurrentUser()

    if (isLoading) return <Loader className='size-4 animate-spin text-muted-foreground' />
    if (!data) return null

    const { name, image } = data

    // TODO: add pending state in signout

    return (
        <DropdownMenu>

            <DropdownMenuTrigger className='outline-none relative' >
                <Avatar className='size-10 hover:opacity-75 transition' >
                    <AvatarImage src={image} alt={name} />
                    <AvatarFallback className='bg-sky-500 text-white' >{name!.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='center' side='right' className='w-60' >
                <DropdownMenuItem onClick={() => signOut()} className='h-10' >
                    <LogOut className='size-4 mr-2' /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>

        </DropdownMenu>
    )
}

export default UserButton