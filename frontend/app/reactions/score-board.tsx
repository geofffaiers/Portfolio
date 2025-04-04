'use client';

import React, { JSX, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useScoreBoard } from './use-score-board';
import { Score } from '@/models';
import { Loader2 } from 'lucide-react';

type Props = {
    counter: number;
    score: number;
    newGame: () => void;
}

export function ScoreBoard({ counter, score, newGame }: Props): JSX.Element {
    const {
        loading,
        globalScores,
        userScores,
        thisScore,
    } = useScoreBoard({ counter, score });

    return (
        <>
            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-white text-shadow-lg z-20'>
                <div className='text-2xl mb-4'>Game Over</div>
                <div className='text-2xl mb-4'>Score: {score}</div>
                <Button onClick={newGame} variant='default' size='lg'>
                    New Game
                </Button>
                {loading ? (
                    <Loader2 className='animate-spin' />
                ): (
                    <>
                        <DisplayScores userScores={false} scores={globalScores} thisScore={thisScore}/>
                        <DisplayScores userScores={true} scores={userScores} thisScore={thisScore}/>
                    </>
                )}
            </div>
        </>
    );
}

type DisplayScoresProps = {
    userScores: boolean;
    scores: Score[] | undefined;
    thisScore: Score | undefined;
}

interface HighlightedScores extends Score {
    isThisScore: boolean
}

function DisplayScores({ userScores, scores, thisScore }: DisplayScoresProps): JSX.Element {
    const [scoreDisplayed, setScoreDisplayed] = useState<boolean>(false);
    const highlightedScores: HighlightedScores[] = useMemo(() => {
        return (scores ?? []).map((score): HighlightedScores => {
            const isThisScore: boolean = thisScore != null && score.id === thisScore.id;
            if (isThisScore && userScores) {
                setScoreDisplayed(true);
            }
            return {
                ...score,
                isThisScore
            };
        });
    }, [scores, userScores, thisScore]);

    if (scores == null || scores.length === 0) {
        return <></>;
    }
    return (
        <>
            <div style={{ marginTop: '1rem' }}>
                <p>{userScores ? 'Your' : 'Global'} Scores</p>
                <table>
                    <TableHeaders />
                    <tbody>
                        {highlightedScores.map((row: HighlightedScores, index) => {
                            return (
                                <ScoreRow key={index} score={row} isThisScore={row.isThisScore}/>
                            );
                        })}
                        {userScores && !scoreDisplayed && thisScore != null && (
                            <ScoreRow score={thisScore} isThisScore={true}/>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    );
}

function TableHeaders(): JSX.Element {
    return (
        <thead>
            <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
            </tr>
        </thead>
    );
}

function ScoreRow({ score, isThisScore }: { score: Score, isThisScore: boolean }): JSX.Element {
    return (
        <tr style={{ borderBlock: isThisScore ? '1px solid hsl(var(--foreground))' : 'none' }}>
            <td>{score?.ranking}</td>
            <td>{score?.name}</td>
            <td style={{ textAlign: 'right' }}>{score?.score}</td>
        </tr>
    );
}
