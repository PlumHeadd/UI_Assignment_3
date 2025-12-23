import '@testing-library/jest-dom'
// Mock the env utility to avoid import.meta issues in Jest
jest.mock('./utils/env', () => ({
  getEnvVar: (key) => process.env[key],
  isBackendEnabled: () => !!(process.env.VITE_BACKEND_URL),
}))