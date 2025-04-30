import React, { JSX } from 'react';
import { Binoculars, Coffee, Loader2, UserX } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Player, Vote } from '@/models';
import { Typography } from '@/components/ui/typography';

import { useCard } from './use-card';

type CardProps = {
    value: JSX.Element | string;
    length: number;
    selected: Vote | null;
    player?: Player;
    hiddenVote?: boolean;
    submitVote?: (value: string) => Promise<void>;
};

export const Card: React.FC<CardProps> = ({ value, length, selected, player, hiddenVote, submitVote }) => {
    const { containerRef, width } = useCard();
    let label: JSX.Element | string = value;
    const hidden = hiddenVote && value !== '';
    if (value === 'coffee') {
        label = <Coffee size={width}/>;
    } else if (value === '') {
        if (player) {
            if (player.online) {
                if (player.role === 'observer') {
                    label = <Binoculars size={width}/>;
                } else {
                    label = <Loader2 size={width} className='animate-spin'/>;
                }
            } else if (player.online === false) {
                label = <UserX size={width}/>;
            }
        }
    }
    const widthStyle = { width: length === 1 ? '100%' : `calc(100%/${length} - 1rem)` };

    return (
        <div
            ref={containerRef}
            style={widthStyle}
            className={cn(
                'aspect-[2/3] rounded-lg border border-current flex items-center justify-center',
                selected?.value === value ? 'bg-muted/50' : '',
                player?.online === false ? 'opacity-25' : '',
                submitVote ? 'cursor-pointer transition-all duration-200 hover:-translate-y-2 hover:bg-muted/50' : '',
                hidden ? 'bg-gradient-to-br from-red-400 to-red-500 bg-[length:1rem_1rem] bg-[linear-gradient(45deg,#f87171_12%,transparent_0,transparent_88%,#f87171_0),linear-gradient(135deg,transparent_37%,#ef4444_0,#ef4444_63%,transparent_0),linear-gradient(45deg,transparent_37%,#f87171_0,#f87171_63%,transparent_0),#fca5a5]' : ''
            )}
            onClick={submitVote ? () => submitVote(String(value)) : undefined}
        >
            {!hidden && (
                <Typography
                    variant='h3'
                    style={{ fontSize: `${width}px` }}
                >{label}</Typography>
            )}
        </div>
    );
};
