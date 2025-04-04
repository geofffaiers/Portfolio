import { Definition } from './definition';

export type Meaning = {
    partOfSpeech: string;
    definitions: Definition[];
    synonyms: string[];
    antonyms: string[];
};
