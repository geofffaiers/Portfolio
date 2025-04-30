module.exports = {
    preset: 'ts-jest',
    setupFiles: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'node',
    coveragePathIgnorePatterns: [
        '/node_modules/'
        ],
    moduleNameMapper: {
        '^@src/(.*)$': '<rootDir>/src/$1',
        '^@mocks/(.*)$': '<rootDir>/__mocks__/$1',
        '^@tests/(.*)$': '<rootDir>/__tests__/$1'
    },
    moduleDirectories: [
        'node_modules'
    ],
    testPathIgnorePatterns: [
        '/node_modules/',
        '/__tests__/types/'
    ],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    }
}