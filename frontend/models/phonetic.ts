import { License } from './license';

export type Phonetic = {
    text: string;
    audio: string;
    sourceUrl: string;
    license: License;
};
