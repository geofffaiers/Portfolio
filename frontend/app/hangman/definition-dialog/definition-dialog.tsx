import React, { JSX, useMemo, useState } from 'react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Typography } from '@/components/ui/typography';
import { Definition, Meaning, WordData } from '@/models';

type Props = {
    wordData: WordData;
};

export const DefinitionDialog: React.FC<Props> = ({ wordData }) => {
    const [open, setOpen] = useState<boolean>(false);
    const {
        word,
        meanings,
        phonetic: _phonetic,
        phonetics: _phonetics,
        sourceUrls: _sourceUrls,
        license: _license
    } = wordData;
    const titleCaseWord = useMemo(() => word.charAt(0).toUpperCase() + word.slice(1), [word]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button
                    variant='outline'
                    size='default'
                    onClick={() => setOpen(true)}
                >
                    Explain {word}?
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{titleCaseWord}</DialogTitle>
                </DialogHeader>
                <DialogDescription className='sr-only'>
                    {`Definitions, synonyms, and antonyms for the word "${titleCaseWord}".`}
                </DialogDescription>
                {meanings.length > 0 && (
                    <Accordion type='single' collapsible className='w-full'>
                        {meanings.map((meaning, index) => (
                            <MeaningRow key={`meaning-${index}`} index={index} meaning={meaning}/>
                        ))}
                    </Accordion>
                )}
                <Button
                    variant='default'
                    size='default'
                    onClick={() => setOpen(false)}
                >
                    Close
                </Button>
            </DialogContent>
        </Dialog>
    );
};

const MeaningRow = ({ index, meaning }: { index: number; meaning: Meaning; }): JSX.Element => {
    const { antonyms, definitions, partOfSpeech, synonyms } = meaning;
    return (
        <div>
            <AccordionItem value={`meaning-${index}`}>
                <AccordionTrigger>As a {partOfSpeech}</AccordionTrigger>
                <AccordionContent>
                    {definitions.length > 0 && <DefinitionComponent index={index} definitions={definitions}/>}
                    {antonyms.length > 0 && (
                        <>
                            <Typography variant='h4'>Antonyms</Typography>
                            {antonyms.map((antonyms, i) => <Typography variant='p' key={`antonym--${index}--${i}`}>{antonyms}</Typography>)}
                        </>
                    )}
                    {synonyms.length > 0 && (
                        <>
                            <Typography variant='h4'>Synonyms</Typography>
                            {synonyms.map((synonyms, i) => <Typography variant='p' key={`synonym--${index}--${i}`}>{synonyms}</Typography>)}
                        </>
                    )}
                </AccordionContent>
            </AccordionItem>
        </div>
    );
};

const DefinitionComponent = ({ index, definitions }: { index: number; definitions: Definition[]; }): JSX.Element => {
    return (
        <>
            <Typography variant='h4'>Definitions</Typography>
            <Typography variant='ul'>
                {definitions.map((definition, i) => <DefinitionRow key={`definition--${index}--${i}`} definition={definition}/>)}
            </Typography>
        </>
    );
};

const DefinitionRow = ({ definition }: { definition: Definition; }): JSX.Element => {
    const { definition: def, example } = definition;
    return (
        <>
            <li>{def}</li>
            {example && (
                <>
                    <Typography variant='p' className='font-semibold'>Example</Typography>
                    <Typography variant='p'>{example}</Typography>
                </>
            )}
        </>
    );
};
