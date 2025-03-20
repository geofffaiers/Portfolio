import fs from 'fs/promises';
import { logError } from './errors';
import axios, { AxiosError } from 'axios';
import { WordWithData } from '../models';

type WordIndex = {
    [key: string]: number[];
};

type LengthIndex = {
    [key: number]: number[];
};

type ValidityCheck = {
    isValid: boolean;
    data?: unknown;
};

type ValidationCache = {
    [word: string]: ValidityCheck;
};

export class Words {
    private static wordsLoaded: boolean = false;
    private static _words: string[] = [];
    private static _wordIndex: WordIndex = {};
    private static _lengthIndex: LengthIndex = {};
    private static _validationCache: ValidationCache = {};
    private static loadPromise: Promise<void> | null = null;
    private static wordsListChanged: boolean = false;
    private static saveTimeout: NodeJS.Timeout | null = null;

    private static async loadWords() {
        if (!this.wordsLoaded) {
            try {
                const data = await fs.readFile(__dirname + '/../data/words.txt', 'utf8');
                const allWords = data.split('\n');
                allWords.forEach(rawWord => {
                    const word = rawWord.trim();
                    if (word) { // Only add non-empty words.
                        const idx = this._words.length;
                        this._words.push(word);
                        this.createIndexes(word, idx);
                    }
                });
                this.wordsLoaded = true;
            } catch (err) {
                logError(err);
            }
        }
    }

    private static createIndexes(word: string, index: number) {
        const firstLetter = word.charAt(0).toLowerCase();
        if (!this._wordIndex[firstLetter]) {
            this._wordIndex[firstLetter] = [];
        }
        this._wordIndex[firstLetter].push(index);
        const length = word.length;
        if (!this._lengthIndex[length]) {
            this._lengthIndex[length] = [];
        }
        this._lengthIndex[length].push(index);
    }

    private static async getWords(firstLetter?: string, length?: number): Promise<string[]> {
        if (!this.wordsLoaded && !this.loadPromise) {
            this.loadPromise = this.loadWords();
        }
        await this.loadPromise;
        let firstLetterWords: Set<string> | null = null;
        let lengthWords: Set<string> | null = null;

        if (firstLetter != null) {
            const indices = this._wordIndex[firstLetter] || [];
            firstLetterWords = new Set(indices.map(index => this._words[index]).filter(word => word));
        }

        if (length != null) {
            const indices = this._lengthIndex[length] || [];
            lengthWords = new Set(indices.map(index => this._words[index]).filter(word => word));
        }

        if (firstLetterWords && lengthWords) {
            return Array.from([...firstLetterWords].filter(word => lengthWords!.has(word)));
        } else if (firstLetterWords) {
            return Array.from(firstLetterWords);
        } else if (lengthWords) {
            return Array.from(lengthWords);
        } else {
            return this._words.filter(word => word);
        }
    }

    public static async getWord(firstLetter?: string, length?: number): Promise<WordWithData> {
        let words: string[] = await this.getWords(firstLetter, length);
        let word: string;
        let isValid: boolean;
        let data: unknown;
        do {
            word = words[Math.floor(Math.random() * words.length)];
            const check: ValidityCheck = await Words.isWordValid(word);
            isValid = check.isValid;
            data = check.data;
            if (!isValid) {
                words = await Words.getWords(firstLetter, length);
                if (words.length === 0) {
                    throw new Error(`No words found for the given combination: ${firstLetter ?? 'no first letter filter'}, ${length ?? 'no length filter'}`);
                }
            }
        } while (!isValid);
        return {
            word,
            data
        };
    }

    private static async isWordValid(word: string): Promise<ValidityCheck> {
        if (this._validationCache[word] !== undefined) {
            return this._validationCache[word];
        }
        let returnValue: ValidityCheck = { isValid: true };
        try {
            const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (response.status === 200) {
                returnValue = {
                    isValid: true,
                    data: response.data
                };
            }
        } catch (err: unknown) {
            if (err instanceof AxiosError) {
                if (err.status === 404) {
                    const index = this._words.indexOf(word);
                    if (index > -1) {
                        this._words[index] = '';

                        const firstLetter = word.charAt(0).toLowerCase();
                        const length = word.length;

                        this._wordIndex[firstLetter] = this._wordIndex[firstLetter].filter(i => i !== index);
                        this._lengthIndex[length] = this._lengthIndex[length].filter(i => i !== index);

                        returnValue = {
                            isValid: false
                        };
                        this.wordsListChanged = true;
                        this.debouncedSaveWordsToFile();
                    }
                }
            }
        }
        this._validationCache[word] = returnValue;
        return returnValue;
    }

    private static debouncedSaveWordsToFile() {
        if (this.saveTimeout) {
            clearTimeout(this.saveTimeout);
        }
        this.saveTimeout = setTimeout(() => {
            this.saveWordsToFile();
        }, 0.5 * 60 * 1000);
    }

    private static async saveWordsToFile() {
        if (!this.wordsListChanged) return;
        try {
            await fs.writeFile(__dirname + '/../data/words.txt', this._words.join('\n'), 'utf8');
            this.wordsListChanged = false;
        } catch (err: unknown) {
            logError(err);
        }
    }
}
