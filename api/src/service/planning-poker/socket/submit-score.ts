import { plainToInstance } from 'class-transformer';
import { sendErrorToClient, sendMessageToClient } from '../../sockets/methods';
import { Client, SocketMessage, SubmitScore, UpdatedRound } from '../../../models/sockets';
import { getClients, getRoundById, saveScoreToDb } from '../methods';

export const submitScoreHandler = async (client: Client, message: SocketMessage): Promise<void> => {
    try {
        const request: SubmitScore = plainToInstance(SubmitScore, message, { excludeExtraneousValues: true });
        await saveScoreToDb(request);
        const foundClients = await getClients(undefined, undefined, request.vote.roundId);
        if (foundClients.length === 0) {
            return;
        }
        const round = await getRoundById(request.vote.roundId);
        if (round == null) {
            throw new Error('Round not found');
        }
        const response: UpdatedRound = new UpdatedRound(round);
        foundClients.forEach((clientForGame: Client) => {
            sendMessageToClient(response, clientForGame.userId);
        });
    } catch (err: unknown) {
        sendErrorToClient(err, client);
    }
};
