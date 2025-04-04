import { WordData } from "./word-data";

export interface WordWithData {
    word: string;
    data?: [WordData];
};
