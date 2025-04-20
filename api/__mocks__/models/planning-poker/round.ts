import { mockVote, mockVoteAlt } from "./vote";

export const mockRound = (roomId: string, gameId: number) => ({
  id: 1,
  roomId,
  gameId,
  inProgress: true,
  roundSuccess: false,
  totalScore: '42.5',
  medianScore: '21.25',
  meanScore: '30.5',
  modeScore: '15',
  lowestScore: '10',
  highestScore: '50',
  countOfDifferentScores: 3,
  finalEstimate: '25',
  endedAt: new Date('2024-01-01T12:00:00Z'),
  createdAt: new Date('2024-01-01T10:00:00Z'),
  updatedAt: new Date('2024-01-01T11:00:00Z'),
  votes: [mockVote('room-1', 1)]
});

export const mockRoundAlt = (roomId: string, gameId: number) => ({
  id: 2,
  roomId,
  gameId,
  inProgress: false,
  roundSuccess: true,
  totalScore: '100',
  medianScore: '50',
  meanScore: '60',
  modeScore: '40',
  lowestScore: '30',
  highestScore: '120',
  countOfDifferentScores: 5,
  finalEstimate: '80',
  endedAt: new Date('2024-02-01T12:00:00Z'),
  createdAt: new Date('2024-02-01T10:00:00Z'),
  updatedAt: new Date('2024-02-01T11:00:00Z'),
  votes: [mockVoteAlt('room-2', 2)]
});