module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/features/rankup/i18n/rankup.i18n.js',
    'src/features/rankup/services/rankup-api.service.js',
    'src/features/rankup/utils/rankup.utils.js',
    'src/features/rankup/utils/video-ranking-modal.utils.js',
  ],
  coverageDirectory: 'coverage',
  coverageProvider: 'v8',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  extensionsToTreatAsEsm: ['.jsx'],
  roots: ['<rootDir>/test'],
  setupFilesAfterEnv: ['<rootDir>/test/setup/jest.setup.js'],
  testEnvironment: 'jsdom',
  testMatch: ['**/*.test.js'],
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
}
