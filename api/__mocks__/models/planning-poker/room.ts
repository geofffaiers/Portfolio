import { mockOwner, mockPlayer, mockObserver } from '@mocks/models/planning-poker/player';
import { mockGame, mockGameAlt } from '@mocks/models/planning-poker/game';

export const mockRoom = () => ({
  id: 'room-1',
  name: 'Room One',
  description: 'First test room',
  players: [mockOwner('room-1'), mockPlayer('room-1'), mockObserver('room-1')],
  createdAt: new Date('2024-01-01T09:00:00Z'),
  updatedAt: new Date('2024-01-01T12:00:00Z'),
  games: [mockGame('room-1')]
});

export const mockRoomAlt = () => ({
  id: 'room-2',
  name: 'Room Two',
  description: 'Second test room',
  players: [mockOwner('room-2'), mockPlayer('room-2'), mockObserver('room-2')],
  createdAt: new Date('2024-02-01T09:00:00Z'),
  updatedAt: new Date('2024-02-01T12:00:00Z'),
  games: [mockGameAlt('room-2')]
});