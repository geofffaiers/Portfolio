import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Player } from '@src/models/planning-poker/player';
import { mockPlayer, mockOwner, mockObserver } from '@mocks/models/planning-poker/player';

describe('Player model', () => {
  it('should transform plain object to Player instance with all fields for player role', async () => {
    const plain = mockPlayer('room-1');

    const instance = plainToInstance(Player, plain);

    expect(instance).toBeInstanceOf(Player);

    expect(instance.id).toBe(plain.id);
    expect(instance.username).toBe(plain.username);
    expect(instance.password).toBe(plain.password);
    expect(instance.email).toBe(plain.email);
    expect(instance.firstName).toBe(plain.firstName);
    expect(instance.lastName).toBe(plain.lastName);
    expect(instance.roomId).toBe(plain.roomId);
    expect(instance.online).toBe(plain.online);
    expect(instance.role).toBe('player');

    const errors = await validate(instance);

    expect(errors).toEqual([]);
    expect(errors.length).toBe(0);
  });

  it('should transform plain object to Player instance with all fields for owner role', async () => {
    const plain = mockOwner('room-2');

    const instance = plainToInstance(Player, plain);

    expect(instance).toBeInstanceOf(Player);

    expect(instance.id).toBe(plain.id);
    expect(instance.username).toBe(plain.username);
    expect(instance.password).toBe(plain.password);
    expect(instance.email).toBe(plain.email);
    expect(instance.firstName).toBe(plain.firstName);
    expect(instance.lastName).toBe(plain.lastName);
    expect(instance.roomId).toBe(plain.roomId);
    expect(instance.online).toBe(plain.online);
    expect(instance.role).toBe('owner');

    const errors = await validate(instance);

    expect(errors).toEqual([]);
    expect(errors.length).toBe(0);
  });

  it('should transform plain object to Player instance with all fields for observer role', async () => {
    const plain = mockObserver('room-3');

    const instance = plainToInstance(Player, plain);

    expect(instance).toBeInstanceOf(Player);

    expect(instance.id).toBe(plain.id);
    expect(instance.username).toBe(plain.username);
    expect(instance.password).toBe(plain.password);
    expect(instance.email).toBe(plain.email);
    expect(instance.firstName).toBe(plain.firstName);
    expect(instance.lastName).toBe(plain.lastName);
    expect(instance.roomId).toBe(plain.roomId);
    expect(instance.online).toBe(plain.online);
    expect(instance.role).toBe('observer');

    const errors = await validate(instance);

    expect(errors).toEqual([]);
    expect(errors.length).toBe(0);
  });

  it('should transform snake_case fields to camelCase properties', async () => {
    const plain = {
      id: 3,
      username: 'snake_case',
      password: 'pass',
      email: 'snake@example.com',
      first_name: 'Snake',
      last_name: 'Case',
      room_id: 'snake-room',
      online: 1,
      role: 'owner'
    };

    const instance = plainToInstance(Player, plain);

    expect(instance.roomId).toBe('snake-room');
    expect(instance.online).toBe(true);
    expect(instance.role).toBe('owner');

    const errors = await validate(instance);

    expect(errors).toEqual([]);
    expect(errors.length).toBe(0);
  });

  it('should validate successfully when all required fields are present for player', async () => {
    const plain = mockPlayer('room-4');

    const instance = plainToInstance(Player, plain);

    const errors = await validate(instance);

    expect(errors).toEqual([]);
    expect(errors.length).toBe(0);
  });

  it('should fail validation if required fields are missing', async () => {
    const plain = {
      username: 'missingfields'
    };

    const instance = plainToInstance(Player, plain);

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toContain('id');
    expect(properties).toContain('password');
    expect(properties).toContain('email');
    expect(properties).toContain('roomId');
    expect(properties).toContain('role');
  });

  it('should fail validation if types are incorrect', async () => {
    const plain = {
      id: 'not-a-number',
      username: 123,
      password: 456,
      email: 789,
      firstName: 101112,
      lastName: 131415,
      roomId: 161718,
      online: 'not-a-boolean',
      role: 192021
    };

    const instance = plainToInstance(Player, plain);

    const errors = await validate(instance);

    expect(errors.length).toBeGreaterThan(0);
    const properties = errors.map(e => e.property);
    expect(properties).toContain('id');
    expect(properties).toContain('username');
    expect(properties).toContain('password');
    expect(properties).toContain('email');
    expect(properties).toContain('firstName');
    expect(properties).toContain('lastName');
    expect(properties).toContain('roomId');
    expect(properties).toContain('role');
  });
});