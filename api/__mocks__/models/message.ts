export const mockSentMessage = () => ({
    id: 1,
    senderId: 1,
    receiverId: 2,
    content: 'Sent Message',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    readAt: new Date('2024-01-01T10:05:00Z')
});

export const mockReceivedMessage = () => ({
    id: 1,
    senderId: 2,
    receiverId: 1,
    content: 'Received Message',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    readAt: new Date('2024-01-01T10:05:00Z')
});
