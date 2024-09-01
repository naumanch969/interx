import React from 'react'

interface Props {
    params: {
        workspaceId: string
    }
}

const Workspace = ({ params: { workspaceId } }: Props) => {
    return (
        <div className='' >
            id: {workspaceId}
        </div>
    )
}

export default Workspace