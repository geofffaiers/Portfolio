import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Score } from '../../models';
import { pool } from '../../helpers';
import { plainToInstance } from 'class-transformer';
import { validateOrReject } from 'class-validator';

export const saveScore = async (userId: number, score: number): Promise<number> => {
    const [result] = await pool.query<ResultSetHeader>(
        `INSERT INTO scores (user_id, score)
        VALUES (?, ?)`,
        [userId, score]
    );
    return result.insertId;
};

const SCORE_SQL: string = `
    s.id,
    COALESCE(
    NULLIF(CONCAT_WS(' ', u.first_name, u.last_name), ''),
    u.username
    ) AS name,
    s.score,
    s.created_at, 
    (SELECT COUNT(*) + 1 FROM scores WHERE score > s.score) AS ranking`;

export const getGlobalScores = async (): Promise<Score[]> => {
    const [result] = await pool.query<Score[] & RowDataPacket[]>(
        `SELECT ${SCORE_SQL}
        FROM scores s
        JOIN users u ON s.user_id = u.id
        ORDER BY s.score DESC
        LIMIT 3;`
    );
    return await convertResultToScores(result);
};

export const getUserScores = async (userId: number | undefined): Promise<Score[]> => {
    const [result] = await pool.query<Score[] & RowDataPacket[]>(
        `SELECT ${SCORE_SQL}
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.user_id = ?
        ORDER BY s.score DESC
        LIMIT 3`,
        [userId]
    );
    return await convertResultToScores(result);
};

export const getThisScore = async (scoreId: number): Promise<Score> => {
    const [result] = await pool.query<Score[] & RowDataPacket[]>(
        `SELECT ${SCORE_SQL}
        FROM scores s
        JOIN users u ON s.user_id = u.id
        WHERE s.id = ?`,
        [scoreId]
    );
    const score: Score = plainToInstance(Score, result[0], { excludeExtraneousValues: true });
    await validateOrReject(score);
    return score;
};

const convertResultToScores = async (result: Score[] & RowDataPacket[]): Promise<Score[]> => {
    if (result.length === 0) {
        return [];
    }
    return await Promise.all(result.map(async (r: Score) => {
        const score: Score = plainToInstance(Score, r, { excludeExtraneousValues: true });
        await validateOrReject(score);
        return score;
    }));
};
