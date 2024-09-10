import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel'
import { Button } from '@/components/ui/button'
import { AlertTriangle, ChevronDown, Loader, Mail, X } from 'lucide-react'
import { useGetMember } from '../api/use-get-member'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { useUpdateMember } from '../api/use-update-member'
import { useRemoveMember } from '../api/use-remove-member'
import { useCurrentMember } from '../api/use-current-member'
import { useWorkspaceId } from '@/hooks/use-workspace-id'
import { toast } from 'sonner'
import { useConfirm } from '@/hooks/use-confirm'
import { DropdownMenu, DropdownMenuRadioGroup, DropdownMenuContent, DropdownMenuRadioItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface Props {
    memberId: Id<"members">,
    onClose: () => void
}

const Profile = ({ memberId, onClose }: Props) => {

    const workspaceId = useWorkspaceId()

    const [RemoveDialog, removeConfirm] = useConfirm("Remove member", "Are you sure you want to remove this member?")
    const [LeaveDialog, leaveConfirm] = useConfirm("Leave workspace", "Are you sure you want to leave this workspace?")
    const [UpdateDialog, updateConfirm] = useConfirm("Change role", "Are you sure you want to change this member's role?")

    const { data: member, isLoading: isLoadingMember } = useGetMember({ id: memberId })
    const { data: currentMember, isLoading: isLoadingCurrentMember } = useCurrentMember({ workspaceId })
    const { mutate: updateMember, isPending: isUpdatingMember } = useUpdateMember()
    const { mutate: removeMember, isPending: isRemovingMember } = useRemoveMember()

    const onRemove = async () => {
        const ok = await removeConfirm()
        if (!ok) return

        removeMember(
            { id: memberId },
            {
                onSuccess() {
                    toast.success("Member removed")
                    onClose()
                },
                onError() {
                    toast.error("Failed to remove member")
                }
            }
        )
    }

    const onLeave = async () => {
        const ok = await leaveConfirm()
        if (!ok) return

        removeMember(
            { id: memberId },
            {
                onSuccess() {
                    toast.success("You left the workspace")
                    onClose()
                },
                onError() {
                    toast.error("Failed to leave the workspace")
                }
            }
        )
    }

    const onUpdateRole = async (role: 'admin' | 'member') => {
        const ok = await updateConfirm()
        if (!ok) return

        updateMember(
            { id: memberId, role },
            {
                onSuccess() {
                    toast.success("Role changed")
                    onClose()
                },
                onError() {
                    toast.error("Failed to change role")
                }
            }
        )
    }

    if (isLoadingMember || isLoadingCurrentMember) return (
        <div className='h-full flex flex-col' >

            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold ">Profile</p>
                <Button variant='ghost' size='iconSm' onClick={onClose} >
                    <X className='size-5 stroke-[1.5]' />
                </Button>
            </div>

            <div className="flex h-full items-center justify-center ">
                <Loader className='size-5 animate-spin text-muted-foreground' />
            </div>

        </div>
    )

    if (!member) return (
        <div className='h-full flex flex-col' >

            <div className="flex justify-between items-center h-[49px] px-4 border-b">
                <p className="text-lg font-bold ">Profile</p>
                <Button variant='ghost' size='iconSm' onClick={onClose} >
                    <X className='size-5 stroke-[1.5]' />
                </Button>
            </div>

            <div className="flex flex-col gap-y-2 h-full items-center justify-center ">
                <AlertTriangle className='size-5 text-muted-foreground' />
                <p className="text-sm text-muted-foreground">Profile not found</p>
            </div>

        </div>
    )


    return (
        <>
            <RemoveDialog />
            <LeaveDialog />
            <UpdateDialog />

            <div className='h-full flex flex-col' >

                <div className="flex justify-between items-center h-[49px] px-4 border-b">
                    <p className="text-lg font-bold ">Profile</p>
                    <Button variant='ghost' size='iconSm' onClick={onClose} >
                        <X className='size-5 stroke-[1.5]' />
                    </Button>
                </div>

                <div className="flex flex-col items-center justify-center p-4">

                    <Avatar className='max-w-[256px] max-h-[256px] size-full ' >
                        <AvatarImage src={member.user.image} />
                        <AvatarFallback className='aspect-square md:text-6xl text-4xl ' >{member.user.name!.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>

                </div>

                <div className="flex flex-col p-4">
                    <p className="text-xl font-bold">{member.user.name}</p>
                    {
                        // Admin options for otherselves
                        currentMember?.role == 'admin' &&
                        currentMember?._id !== memberId &&
                        <div className='flex items-center gap-2 mt-4' >
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild >
                                    <Button
                                        onClick={onRemove}
                                        variant='outline'
                                        disabled={isUpdatingMember}
                                        className='w-full capitalize'
                                    >
                                        {member.role}
                                        <ChevronDown />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className='w-full ' >
                                    <DropdownMenuRadioGroup value={member.role} onValueChange={role => onUpdateRole(role as 'admin' | 'member')} >
                                        <DropdownMenuRadioItem value='admin' >Admin</DropdownMenuRadioItem>
                                        <DropdownMenuRadioItem value='member' >Member</DropdownMenuRadioItem>
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button
                                onClick={onRemove}
                                variant='outline'
                                disabled={isRemovingMember}
                                className='w-full '
                            >
                                Remove
                            </Button>
                        </div>
                    }
                    {
                        // User Options for self
                        currentMember?.role !== 'admin' &&
                        currentMember?._id == memberId &&
                        <div className='mt-4' >
                            <Button
                                onClick={onLeave}
                                variant='outline'
                                disabled={isRemovingMember}
                                className='w-full '
                            >
                                Leave
                            </Button>
                        </div>
                    }
                </div>

                <Separator />

                <div className="flex flex-col p-4">
                    <p className="text-sm font-bold mb-4">Contact Information</p>
                    <div className="flex items-center gap-2">
                        <div className="size-9 rounded-md bg-muted flex items-center justify-center ">
                            <Mail className='size-4' />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-[13px] font-semibold text-muted-foreground ">Email Address</p>
                            <Link href={`mailto:${member.user.email}`} className='text-sm hover:underline text-[#1264a3] ' >
                                {member.user.email}
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default Profile