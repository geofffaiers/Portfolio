import { useCallback, useEffect, useState } from 'react';

import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { Round, SubmitMessage, Vote } from '@/models';
import { useSocketContext } from '@/components/providers/socket-provider';

import { useOptions } from '../use-options';

type Props = {
    playerId: number;
    round: Round;
};

type UseCards = {
    selected: Vote | null;
    options: string[];
    submitVote: (value: string) => Promise<void>;
};

export const useCards = ({ playerId, round }: Props): UseCards => {
    const { displayError } = useToastWrapper();
    const { sendSocketMessage } = useSocketContext();
    const [selected, setSelected] = useState<Vote | null>(null);
    const options = useOptions();

    useEffect(() => {
        const vote = round.votes.find((v) => v.playerId === playerId) ?? null;
        if (vote != null) {
            setSelected(vote);
        }
    }, [playerId, round.votes]);

    const submitVote = useCallback(async (value: string) => {
        if (round == null) {
            displayError('No round to vote on');
            return;
        }
        const vote = new Vote();
        vote.roomId = round.roomId;
        vote.playerId = playerId;
        vote.roundId = round?.id;
        vote.value = value;
        sendSocketMessage(new SubmitMessage(vote));
        setSelected(vote);
    }, [round, playerId, displayError, sendSocketMessage]);

    useEffect(() => {
        setSelected(null);
    }, [round.id]);

    return {
        selected,
        options,
        submitVote,
    };
};
