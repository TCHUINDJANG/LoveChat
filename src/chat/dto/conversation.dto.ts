export class ConversationDto {
    id: number;
    matchId: number;
    matchName: string;
    matchPhoto: string;
    lastMessage: string;
    lastMessageTime: Date;
    unreadCount: number;
}