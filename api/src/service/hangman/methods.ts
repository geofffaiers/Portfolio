import axios, { AxiosError } from 'axios';
import { WordWithData } from '../../models';
import { pool } from '../../helpers/db';
import { RowDataPacket } from 'mysql2';

type ValidityCheck = {
    isValid: boolean;
    data?: unknown;
};

export async function getWordFromDatabase(firstLetter?: string, length?: number): Promise<WordWithData> {
    let word: string;
    let data: unknown;
    let attempts = 0;
    const maxAttempts = 10;

    do {
        word = await getRandomWord(firstLetter, length);
        if (!word) {
            throw new Error(`No words found for the given combination: ${firstLetter ?? 'no first letter filter'}, ${length ?? 'no length filter'}`);
        }

        const check = await isWordValid(word);
        if (check.isValid) {
            data = check.data;
            break;
        }

        attempts++;
    } while (attempts < maxAttempts);

    if (attempts >= maxAttempts) {
        throw new Error('Unable to find a valid word after multiple attempts');
    }

    return { word, data };
}

async function getRandomWord(firstLetter?: string, length?: number): Promise<string> {
    let whereClause = 'WHERE is_valid IS NOT FALSE';
    const params: string[] = [];

    if (firstLetter) {
        whereClause += ' AND first_letter = ?';
        params.push(firstLetter.toLowerCase());
    }

    if (length) {
        whereClause += ' AND length = ?';
        params.push(length.toString());
    }

    // Get random word using OFFSET with subquery for better performance
    const [countResult] = await pool.query<RowDataPacket[]>(
        `SELECT COUNT(*) as count FROM words ${whereClause}`,
        params
    );

    const totalCount = countResult[0].count;
    if (totalCount === 0) return '';

    const randomOffset = Math.floor(Math.random() * totalCount);

    const [result] = await pool.query<RowDataPacket[]>(
        `SELECT word FROM words ${whereClause} LIMIT 1 OFFSET ?`,
        [...params, randomOffset]
    );

    return result[0]?.word || '';
}

async function isWordValid(word: string): Promise<ValidityCheck> {
    // Check database cache directly
    const [dbResult] = await pool.query<RowDataPacket[]>(
        'SELECT is_valid, validation_data FROM words WHERE word = ? AND is_valid IS NOT NULL',
        [word]
    );

    if (dbResult.length > 0) {
        return {
            isValid: Boolean(dbResult[0].is_valid),
            data: dbResult[0].validation_data
        };
    }

    // Validate with external API
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
        if (err instanceof AxiosError && err.status === 404) {
            returnValue = { isValid: false };
        }
    }

    // Update database with validation result
    await pool.query(
        `UPDATE words 
         SET is_valid = ?, validation_data = ?, validated_at = NOW() 
         WHERE word = ?`,
        [returnValue.isValid, returnValue.data ? JSON.stringify(returnValue.data) : null, word]
    );

    return returnValue;
}