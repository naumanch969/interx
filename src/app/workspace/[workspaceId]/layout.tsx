"use client"

import React, { ReactNode } from 'react'
import Toolbar from './toolbar'
import Sidebar from './sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import WorkspaceSidebar from './workspace-sidebar'
import { usePanel } from '@/hooks/use-panel'
import { Loader } from 'lucide-react'
import { Id } from '../../../../convex/_generated/dataModel'
import Threads from '@/features/messages/components/threads'
import Profile from '@/features/members/components/profile'

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {

    const { parentMessageId, onClose, profileMemberId } = usePanel()

    const showPanel = !!parentMessageId || !!profileMemberId

    return (
        <div className='h-full' >
            <Toolbar />
            <div className='flex h-[calc(100vh-40px)] ' >
                <Sidebar />
                {/* TODO: Fix: resizable panel size restored to the saved one from default in a blink (react-resizable-panel) */}
                <ResizablePanelGroup direction='horizontal' autoSaveId='nc-workspace-layout' >

                    <ResizablePanel defaultSize={18} minSize={11} className='bg-[#5e2c5f]' >
                        <WorkspaceSidebar />
                    </ResizablePanel>

                    <ResizableHandle withHandle />

                    <ResizablePanel defaultSize={82} minSize={25} >
                        {children}
                    </ResizablePanel>

                    {
                        showPanel &&
                        <>
                            <ResizableHandle withHandle />
                            <ResizablePanel minSize={20} defaultSize={29} >
                                {
                                    parentMessageId
                                        ?
                                        <Threads
                                            messageId={parentMessageId as Id<"messages">}
                                            onClose={onClose}
                                        />
                                        :
                                        profileMemberId
                                            ?
                                            <Profile
                                                memberId={profileMemberId as Id<"members">}
                                                onClose={onClose}
                                            />
                                            :
                                            <div className="flex h-full items-center justify-center ">
                                                <Loader className='size-5 animate-spin text-muted-foreground' />
                                            </div>
                                }

                            </ResizablePanel>
                        </>
                    }
                </ResizablePanelGroup>
            </div>
        </div>
    )
}

export default WorkspaceLayout