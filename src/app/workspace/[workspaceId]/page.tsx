"use client"

import { useWorkspaceId } from "@/app/hooks/use-workspace-id"
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace"
import { useParams } from "next/navigation"

const Workspace = () => {

    const workspaceId = useWorkspaceId()
    const { data } = useGetWorkspace({ id: workspaceId })


    return (
        <div className='' >
            id: {data?.name}
        </div>
    )
}

export default Workspace