import { useProfileMemberId } from "@/features/members/store/use-profile-member-id";
import { useParentMessageId } from "@/features/messages/store/use-parent-message-id";

export const usePanel = () => {
    const [parentMessageId, setParentMessageId] = useParentMessageId()
    const [profileMemberId, setProfileMemberId] = useProfileMemberId()

    const onOpenProfile = (memberId: string) => {
        setProfileMemberId(memberId)
        setParentMessageId('')
    }

    const onOpenMessage = (messageId: string) => {
        setParentMessageId(messageId)
        setProfileMemberId('')
    }

    const onClose = () => {
        setParentMessageId('')
        setProfileMemberId('')
    }

    return {
        parentMessageId,
        onOpenMessage,
        profileMemberId,
        onOpenProfile,
        onClose,
    }
}