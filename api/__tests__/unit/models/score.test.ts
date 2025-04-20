import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Score } from '@src/models/score';
import { mockScore, mockScoreAlt } from '@mocks/models/score';

describe('Score model', () => {
  it('should transform plain object to Score instance with all fields', () => {
    const plain = mockScore();

    const instance = plainToInstance(Score, plain);

    expect(instance).toBeInstanceOf(Score);

    expect(instance.id).toBe(plain.id);
    expect(instance.name).toBe(plain.name);
    expect(instance.score).toBe(plain.score);
    expect(instance.createdAt).toEqual(plain.createdAt);
    expect(instance.ranking).toBe(plain.ranking);
  });

  it('should transform snake_case created_at to createdAt', () => {
    const plain = {
      ...mockScoreAlt(),
      created_at: mockScoreAlt().createdAt,
      createdAt: undefined
    };

    const instance = plainToInstance(Score, plain);

    expect(instance.createdAt).toEqual(mockScoreAlt().createdAt);
  });

  it('should validate successfully when all required fields are present', async () => {
    const plain = mockScoreAlt();

    const instance = plainToInstance(Score, plain);

    const errors = await validate(instance);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if required fields are missing', async () => {
    const plain = {
      name: 'Missing Fields'
    };

    const instance = plainToInstance(Score, plain);

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toContain('id');
    expect(properties).toContain('score');
    expect(properties).toContain('createdAt');
    expect(properties).toContain('ranking');
  });

  it('should fail validation if types are incorrect', async () => {
    const plain = {
      id: 'not-a-number',
      name: 123,
      score: 'not-a-number',
      createdAt: 'not-a-date',
      ranking: 'not-a-number'
    };

    const instance = plainToInstance(Score, plain);

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toContain('id');
    expect(properties).toContain('name');
    expect(properties).toContain('score');
    expect(properties).toContain('createdAt');
    expect(properties).toContain('ranking');
  });
});