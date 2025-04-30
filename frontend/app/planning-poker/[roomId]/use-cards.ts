import { useCallback, useEffect, useState } from 'react';

import { useAuthContext } from '@/components/providers/auth-provider';
import { useToastWrapper } from '@/hooks/use-toast-wrapper';
import { Round, SubmitMessage, Vote } from '@/models';
import { useSocketContext } from '@/components/providers/socket-provider';

import { useOptions } from '../use-options';

type Props = {
    round: Round;
};

type UseCards = {
    selected: Vote | null;
    options: string[];
    submitVote: (value: string) => Promise<void>;
};

export const useCards = ({ round }: Props): UseCards => {
    const { user } = useAuthContext();
    const { displayError } = useToastWrapper();
    const { sendSocketMessage } = useSocketContext();
    const [selected, setSelected] = useState<Vote | null>(null);
    const options = useOptions();

    useEffect(() => {
        const vote = round.votes.find((v) => v.userId === user?.id) ?? null;
        if (vote != null) {
            setSelected(vote);
        }
    }, [user?.id, round.votes]);

    const submitVote = useCallback(async (value: string) => {
        if (user == null) {
            displayError('Unable to vote when not logged in');
            return;
        }
        if (round == null) {
            displayError('No round to vote on');
            return;
        }
        const vote = new Vote();
        vote.roomId = round.roomId;
        vote.userId = user?.id;
        vote.roundId = round?.id;
        vote.value = value;
        sendSocketMessage(new SubmitMessage(vote));
        setSelected(vote);
    }, [round, user, displayError, sendSocketMessage]);

    useEffect(() => {
        setSelected(null);
    }, [round.id]);

    return {
        selected,
        options,
        submitVote,
    };
};
