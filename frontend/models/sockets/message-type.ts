export enum MessageType {
    ERROR = 'error',
    // Messaging
    NEW_MESSAGE = 'newMessage',
    READ_MESSAGE = 'readMessage',
    UPDATED_MESSAGE = 'updatedMessage',
    // Profile
    UPDATED_PROFILE = 'updatedProfile',
    DELETE_PROFILE = 'deleteProfile',
    // Planning Poker
    JOIN_GAME = 'joinGame',
    LEAVE_GAME = 'leaveGame',
    NEW_GAME = 'newGame',
    NEW_ROUND = 'newRound',
    UPDATED_ROOM = 'updatedRoom',
    UPDATED_PLAYERS = 'updatedPlayers',
    UPDATED_GAME = 'updatedGame',
    UPDATED_ROUND = 'updatedRound',
    SUBMIT_SCORE = 'submitScore',
}
