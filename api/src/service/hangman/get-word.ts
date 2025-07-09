import { Request } from 'express';
import { DefaultResponse, WordWithData } from '../../models';
import { handleError } from '../../helpers';
import { getWordFromDatabase } from './methods';

export const getWord = async (req: Request): Promise<DefaultResponse<WordWithData>> => {
    try {
        const firstLetter: string | undefined = req.query.firstLetter
            ? String(req.query.firstLetter).toLowerCase()
            : undefined;
        const length: number | undefined = req.query.length
            ? parseInt(req.query.length as string)
            : undefined;
        const { word, data }: WordWithData = await getWordFromDatabase(firstLetter, length);
        return {
            success: true,
            code: 200,
            data: {
                word,
                data
            }
        };
    } catch (error: unknown) {
        return handleError(error);
    }
};
