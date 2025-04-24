export const mockVote = (roomId: string, roundId: number) => ({
    id: 1,
    roomId,
    roundId,
    userId: 101,
    value: '5',
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T11:00:00Z')
});

export const mockVoteAlt = (roomId: string, roundId: number) => ({
    id: 2,
    roomId,
    roundId,
    userId: 202,
    value: '8',
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T11:00:00Z')
});
