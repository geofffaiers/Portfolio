import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Project } from '@src/models/project';

describe('Project model', () => {
    it('should transform plain object to Project instance with all fields', () => {
        const plain = {
            id: 5,
            name: 'Test Project',
            isEnabled: true
        };

        const instance = plainToInstance(Project, plain);

        expect(instance).toBeInstanceOf(Project);

        expect(instance.id).toBe(5);
        expect(instance.name).toBe('Test Project');
        expect(instance.isEnabled).toBe(true);
    });

    it('should transform snake_case is_enabled to isEnabled as true', () => {
        const plain = {
            id: 2,
            name: 'Snake Project',
            is_enabled: 1
        };

        const instance = plainToInstance(Project, plain);

        expect(instance.isEnabled).toBe(true);
    });

    it('should transform is_enabled boolean true to isEnabled as true', () => {
        const plain = {
            id: 3,
            name: 'Bool Project',
            is_enabled: true
        };

        const instance = plainToInstance(Project, plain);

        expect(instance.isEnabled).toBe(true);
    });

    it('should transform is_enabled 0 to isEnabled as false', () => {
        const plain = {
            id: 4,
            name: 'Disabled Project',
            is_enabled: 0
        };

        const instance = plainToInstance(Project, plain);

        expect(instance.isEnabled).toBe(false);
    });

    it('should validate successfully with all required fields', async () => {
        const plain = {
            id: 1,
            name: 'Valid Project',
            isEnabled: false
        };

        const instance = plainToInstance(Project, plain);

        const errors = await validate(instance);

        expect(errors.length).toBe(0);
    });

    it('should fail validation if required fields are missing', async () => {
        const plain = {
            id: null,
            name: 'Missing ID',
            isEnabled: null
        };

        const instance = plainToInstance(Project, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
    });

    it('should fail validation if types are incorrect', async () => {
        const plain = {
            id: 'not-a-number',
            name: 123
        };

        const instance = plainToInstance(Project, plain);

        const errors = await validate(instance);

        expect(errors.length).toBeGreaterThan(0);
        const properties = errors.map(e => e.property);
        expect(properties).toContain('id');
        expect(properties).toContain('name');
    });
});
