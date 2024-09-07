import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { useCurrentMember } from '@/features/members/api/use-current-member'
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace'
import { AlertTriangle, Hash, Loader, MessageSquareText, SendHorizonal, User } from 'lucide-react'
import React from 'react'
import WorkspaceHeader from './workspace-header'
import SidebarItem from './sidebar-item'
import { useGetChannels } from '@/features/channels/api/use-get-channels'
import WorkspaceSection from './workspace-section'
import { useGetMembers } from '@/features/members/api/use-get-members'
import UserItem from './user-item'
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal'
import { useChannelId } from '@/hooks/use-channel-id'

const WorkspaceSidebar = () => {

    const workspaceId = useWorkspaceId()
    const channelId = useChannelId()

    const [_open, setOpen] = useCreateChannelModal()

    const { data: member, isLoading: memberLoading } = useCurrentMember({ workspaceId })
    const { data: members, isLoading: membersLoading } = useGetMembers({ workspaceId })
    const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({ id: workspaceId })
    const { data: channels, isLoading: channelsLoading } = useGetChannels({ workspaceId })

    if (memberLoading || workspaceLoading) return (
        <div className="flex flex-col bg-[#532c5f] h-full items-center justify-center">
            <Loader className='size-5 animate-spin text-white' />
        </div>
    )

    if (!workspace || !member) return (
        <div className="flex flex-col bg-[#532c5f] h-full gap-y-2 items-center justify-center">
            <AlertTriangle className='size-5 text-white' />
            <p className="text-white text-sm">Workspace not found</p>
        </div>
    )


    return (
        <div className="flex flex-col bg-[#532c5f] h-full">
            <WorkspaceHeader />

            <div className='flex flex-col gap-y-1 px-2 mt-3' >
                <SidebarItem
                    label='Threads'
                    icon={MessageSquareText}
                    id='threads'
                />
                <SidebarItem
                    label='Drafts & Sent'
                    icon={SendHorizonal}
                    id='drafts'
                />
            </div>
            <WorkspaceSection label='Channels' hint='New channel' onNew={member?.role == 'admin' ? () => setOpen(true) : undefined} >
                {
                    channels?.map((item, index) => (
                        <SidebarItem
                            key={index}
                            label={item?.name}
                            icon={Hash}
                            id={item?._id}
                            variant={channelId == item?._id ? 'active' : 'default'}
                        />
                    ))
                }
            </WorkspaceSection>
            <WorkspaceSection label='Direct messages' hint='New direct message' onNew={() => { }} >
                {
                    members?.map((item, index) => (
                        <UserItem
                            key={index}
                            label={item?.user?.name!}
                            image={item?.user?.image!}
                            id={item?._id}
                        />
                    ))
                }
            </WorkspaceSection>

        </div>
    )
}

export default WorkspaceSidebar