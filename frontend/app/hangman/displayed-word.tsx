

type Props = {
    word: string;
    guessedLetters: string[];
    isGameLost: boolean;
}

export const DisplayedWord: React.FC<Props> = ({ word, guessedLetters, isGameLost }) => {
    return (
        <>
            {
                word.split('').map((letter, index) => (
                    <span key={index} className="mx-1 text-2xl">
                        {guessedLetters.includes(letter)
                            ? letter.toUpperCase()
                            : isGameLost
                                ? <span key={`incorrect-guess--${index}`} className='text-red-500'>{letter.toUpperCase()}</span>
                                : '_'
                        }
                    </span>
                ))
            }
        </>
    );
};
