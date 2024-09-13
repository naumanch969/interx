"use client"
import UserButton from '@/features/auth/comonents/user-button';
import { useCreateWorkspaceModal } from '@/features/workspaces/store/use-create-workspace-modal';
import { useGetWorkspaces } from '@/features/workspaces/api/use-get-workspaces';
import { useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Workspace() {

  const { data, isLoading } = useGetWorkspaces()
  const [open, setOpen] = useCreateWorkspaceModal()
  const workspaceId = useMemo(() => data?.[0]?._id, [data])
  const router = useRouter()

  useEffect(() => {

    if (isLoading) return

    if (workspaceId) {
      router.replace(`/workspace/${workspaceId}`)
    }
    else if (!open) {
      setOpen(true)
    }

  }, [workspaceId, isLoading, open, setOpen, router])

  return (
    <div className='flex flex-col justify-center items-center gap-4 w-full h-screen' >

      <div className="w-64 h-20 relative ">
        <Image
          src='/logo_purple.png'
          alt='Logo'
          layout='fill'
          className='animate-pulse'
        />
      </div>

    </div>
  );
}