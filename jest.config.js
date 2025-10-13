export default {
  preset: null,
  extensionsToTreatAsEsm: ['.js', '.ts'],
  globals: {
    'vitest/globals': true,
  },
  testEnvironment: 'node',
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.ts',
    '!src/**/*.test.js',
    '!src/**/*.test.ts',
  ],
}
