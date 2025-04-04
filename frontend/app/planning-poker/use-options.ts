import { useMemo } from 'react';

type UseOptions = string[];

export const useOptions = (): UseOptions => {

    const options = useMemo(() => {
        return ['0', '1/2', '1', '2', '3', '5', '8', '13', '21', '34', '?', 'coffee'];
    }, []);

    return options;
};
