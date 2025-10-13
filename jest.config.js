export default {
  preset: null,
  extensionsToTreatAsEsm: ['.js'],
  globals: {
    'vitest/globals': true,
  },
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
};
