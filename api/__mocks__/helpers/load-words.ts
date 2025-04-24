import { Words } from '@src/helpers/load-words';

export const mockWords = ['apple', 'banana', 'date', 'egg'];

export interface WordsStatics {
  wordsLoaded: boolean;
  _words: string[];
  _wordIndex: Record<string, number[]>;
  _lengthIndex: Record<number, number[]>;
  _validationCache: Record<string, { isValid: boolean; data?: unknown }>;
  loadPromise: Promise<void> | null;
  wordsListChanged: boolean;
  saveTimeout: NodeJS.Timeout | null;
}

export const resetWordsStatics = (): void => {
    const statics = Words as unknown as WordsStatics;
    if (statics.saveTimeout) {
        clearTimeout(statics.saveTimeout);
        statics.saveTimeout = null;
    }
    statics.wordsLoaded = false;
    statics._words = [];
    statics._wordIndex = {};
    statics._lengthIndex = {};
    statics._validationCache = {};
    statics.loadPromise = null;
    statics.wordsListChanged = false;
};
