import { Round } from "@/models"

type UseRoundMetrics = {

};

type Props = {
    displayMetrics: boolean;
    setDisplayMetrics: (value: boolean) => void;
    round: Round;
};

export const useRoundMetrics = ({ displayMetrics, setDisplayMetrics, round }: Props): UseRoundMetrics => {
    return {

    };
};
