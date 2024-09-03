"use client"

import React, { ReactNode } from 'react'
import Toolbar from './toolbar'
import Sidebar from './sidebar'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import WorkspaceSidebar from './workspace-sidebar'

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='h-full' >
            <Toolbar />
            <div className='flex h-[calc(100vh-40px)] ' >
                <Sidebar />
                <ResizablePanelGroup direction='horizontal' autoSaveId='nc-workspace-layout' >
                    <ResizablePanel defaultSize={18} minSize={11} className='bg-[#5e2c5f]' >
                        <WorkspaceSidebar />
                    </ResizablePanel>
                    <ResizableHandle withHandle></ResizableHandle>
                    <ResizablePanel minSize={25} >
                        {children}
                    </ResizablePanel>
                </ResizablePanelGroup>
            </div>
        </div>
    )
}

export default WorkspaceLayout