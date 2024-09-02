"use client"

import React, { ReactNode } from 'react'
import Toolbar from './toolbar'
import Sidebar from './sidebar'

const WorkspaceLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className='h-full' >
            <Toolbar />
            <div className='flex h-[calc(100vh-40px)] ' >
                <Sidebar />
                {children}
            </div>
        </div>
    )
}

export default WorkspaceLayout