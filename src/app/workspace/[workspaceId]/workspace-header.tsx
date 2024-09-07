import { useWorkspaceId } from '@/hooks/use-workspace-id'
import Hint from '@/components/hint'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { ChevronDown, ListFilter, SquarePen } from 'lucide-react'
import React, { useState } from 'react'
import PreferencesModal from './preferences-modal'
import InviteModal from './invite-modal'

const WorkspaceHeader = () => {

    const workspaceId = useWorkspaceId()
    const { data: workspace } = useGetWorkspace({ id: workspaceId })
    const { data: member } = useCurrentMember({ workspaceId })
    const isAdmin = member?.role == 'admin'

    const [openPreferences, setOpenPreferences] = useState(false)
    const [openInvite, setOpenInvite] = useState(false)

    return (
        <>
          
            <InviteModal open={openInvite} setOpen={setOpenInvite} name={workspace?.name!} joinCode={workspace?.joinCode!}  />
            <PreferencesModal open={openPreferences} setOpen={setOpenPreferences} initialValue={workspace?.name!} />
          
            <div className='flex items-center justify-between px-4 h-[49px] gap-0.5' >

                <DropdownMenu>
                    <DropdownMenuTrigger asChild >
                        <Button variant='transparent' className='font-semibold text-lg w-auto p-1.5 overflow-hidden ' >
                            <span className="truncate">{workspace?.name}</span>
                            <ChevronDown className='size-4 ml-1 shrink-0 ' />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side='bottom' align='start' className='w-64' >
                        <DropdownMenuItem className='cursor-pointer capitalize' >
                            <div className="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2 ">
                                {workspace?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex flex-col items-start">
                                <p className="font-bold">{workspace?.name}</p>
                                <p className="text-xs text-muted-foreground">Active workspace</p>
                            </div>
                        </DropdownMenuItem>
                        {
                            isAdmin &&
                            <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpenInvite(true)} className='cursor-pointer py-2' >
                                    Invite people to {workspace?.name}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setOpenPreferences(true)} className='cursor-pointer py-2' >
                                    Preferences
                                </DropdownMenuItem>
                            </>
                        }
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="flex items-center gap-0.5">
                    <Hint label='Filter Conversations' side='bottom' >
                        <Button variant='transparent' size='sm' ><ListFilter className='size-4' /></Button>
                    </Hint>
                    <Hint label='New Message' side='bottom' >
                        <Button variant='transparent' size='sm' ><SquarePen className='size-4' /></Button>
                    </Hint>
                </div>

            </div >
        </>
    )
}

export default WorkspaceHeader