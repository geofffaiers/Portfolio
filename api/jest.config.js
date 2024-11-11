module.exports = {
  setupFiles: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'node',
  coveragePathIgnorePatterns: [
    '/node_modules/'
  ],
  moduleNameMapper: {
    '^@models/(.*)$': '<rootDir>/../shared/models/$1',
    '^@shared/(.*)$': '<rootDir>/../shared/node_modules/$1'
  },
  moduleDirectories: [
    'node_modules',
    '<rootDir>/../shared/node_modules'
  ]
}
