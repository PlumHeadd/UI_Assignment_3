module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(uuid|@dnd-kit)/)',
  ],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/e2e/',
  ],
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/setupTests.js',
    '!src/App.jsx',
    '!src/components/Board.jsx',
    '!src/components/ListColumn.jsx',
    '!src/components/CardDetailModal.jsx',
    '!src/components/MergeConflictDialog.jsx',
  ],
  coverageThreshold: {
    global: {
      lines: 70,
      statements: 70,
      branches: 60,
      functions: 70,
    },
  },
  modulePathIgnorePatterns: ['<rootDir>/src/utils/__mocks__'],
}
