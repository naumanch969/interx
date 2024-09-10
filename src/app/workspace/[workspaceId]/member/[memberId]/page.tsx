"use client"

import { useCreateOrGetConversation } from '@/features/conversations/api/use-create-or-get-conversation'
import { useMemberId } from '@/hooks/use-member-id'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { AlertTriangle, Loader } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { Id } from '../../../../../../convex/_generated/dataModel'
import { toast } from 'sonner'
import Conversation from './conversation'

const MemberPage = () => {

  const workspaceId = useWorkspaceId()
  const memberId = useMemberId()
  const { mutate, isPending } = useCreateOrGetConversation()

  const [conversationId, setConversationId] = useState<Id<"conversations"> | null>(null)

  useEffect(() => {
    mutate(
      { workspaceId, memberId },
      {
        onSuccess(data) {
          setConversationId(data)
        },
        onError() {
          toast.error("Failed to get conversation.")
        }
      }
    )
  }, [mutate, workspaceId, memberId])



  if (isPending) return (
    <div className='h-full flex justify-center items-center' >
      <Loader className='size-6 animate-spin text-muted-foreground' />
    </div>
  )

  if (!conversationId) return (
    <div className='h-full flex flex-col justify-center items-center' >
      <AlertTriangle className='size-6 text-muted-foreground' />
      <span className="text-sm text-muted-foreground">Conversation not found</span>
    </div>
  )

  return (
    <Conversation id={conversationId!} />
  )
}

export default MemberPage