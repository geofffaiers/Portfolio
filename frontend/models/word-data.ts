
import { License } from "./license";
import { Meaning } from "./meaning";
import { Phonetic } from "./phonetic";

export type WordData = {
    word: string;
    phonetic: string;
    phonetics: Phonetic[];
    meanings: Meaning[];
    sourceUrls: string[];
    license: License;
};
