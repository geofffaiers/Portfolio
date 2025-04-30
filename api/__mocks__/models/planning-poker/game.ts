import { mockRound, mockRoundAlt } from '@mocks/models/planning-poker/round';

export const mockGame = (roomId: string) => ({
    id: 1,
    roomId,
    name: 'Game One',
    inProgress: true,
    createdAt: new Date('2024-01-01T10:00:00Z'),
    updatedAt: new Date('2024-01-01T11:00:00Z'),
    rounds: [mockRound(roomId, 1)]
});

export const mockGameAlt = (roomId: string) => ({
    id: 2,
    roomId,
    name: 'Game Two',
    inProgress: false,
    createdAt: new Date('2024-02-01T10:00:00Z'),
    updatedAt: new Date('2024-02-01T11:00:00Z'),
    rounds: [mockRoundAlt(roomId, 2)]
});
