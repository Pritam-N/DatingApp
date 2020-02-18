export interface Message {
    id: number;
    senderId: number;
    senderCommonName: string;
    senderPhotoUrl: string;
    recipientId: number;
    recipientCommonName: string;
    recipientPhotoUrl: string;
    content: string;
    isRead: boolean;
    dateRead: Date;
    messageSent: Date;
}
