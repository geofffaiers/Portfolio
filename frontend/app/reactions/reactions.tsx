'use client';

import React, { JSX } from 'react';
import { DEFAULT_TIME, useReactions } from './use-reactions';
import { ScoreBoard } from './score-board';

export function Reactions(): JSX.Element {
    const {
        componentRef,
        canvasRef,
        playing,
        displayGame,
        counter,
        score,
        timeLeft,
        animateScore,
        newGame,
    } = useReactions();

    const percentageTimeLeft: number = timeLeft / DEFAULT_TIME;
    return (
        <div className='relative w-full h-full overflow-hidden' ref={componentRef}>
            <canvas className={`absolute top-0 left-0 z-0 ${displayGame ? '' : 'invisible'}`} ref={canvasRef}/>
            {displayGame && (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center'>
                    <div className={`duration-200 ${animateScore ? 'transform scale-150' : ''} text-6xl font-bold select-none text-center`}>
                        {score === 0 ? 'Pop the bubbles' : score}
                    </div>
                </div>
            )}
            {playing && (
                <>
                    <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 mb-4 text-xl'>
                        Time remaining: {timeLeft}
                    </div>
                    <div className='absolute bottom-0 left-0 w-full h-4'>
                        <div
                            className='h-full'
                            style={{
                                width: `${percentageTimeLeft * 100}%`,
                                backgroundColor: `rgb(${255 - percentageTimeLeft * 255}, ${percentageTimeLeft * 255}, 0)`,
                                transition: 'width 1s linear, background-color 1s linear',
                            }}
                        />
                    </div>
                </>
            )}
            {!displayGame && <ScoreBoard counter={counter} score={score} newGame={newGame}/>}
        </div>
    );
}
