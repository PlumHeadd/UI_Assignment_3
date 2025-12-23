// Mock process.env
const originalEnv = process.env

describe('env', () => {
  beforeEach(() => {
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('isBackendEnabled', () => {
    test('should return true when VITE_BACKEND_URL is set', () => {
      process.env.VITE_BACKEND_URL = 'http://localhost:5000'

      // Re-import to get fresh module with new env
      jest.resetModules()
      const { isBackendEnabled } = require('../utils/env')
      expect(isBackendEnabled()).toBe(true)
    })

    test('should return false when VITE_BACKEND_URL is not set', () => {
      delete process.env.VITE_BACKEND_URL

      jest.resetModules()
      const { isBackendEnabled } = require('../utils/env')
      expect(isBackendEnabled()).toBe(false)
    })

    test('should return false when VITE_BACKEND_URL is empty string', () => {
      process.env.VITE_BACKEND_URL = ''

      jest.resetModules()
      const { isBackendEnabled } = require('../utils/env')
      expect(isBackendEnabled()).toBe(false)
    })
  })
})