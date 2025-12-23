// Environment detection utility that works in Jest, Vite, and Node
// Jest will use the mocked version from __mocks__/env.js
export function getEnvVar(key) {
  // In browser/Vite, this will work normally
  // Jest will never execute this because it uses the mock
  return import.meta.env[key]
}

export function isBackendEnabled() {
  return !!(getEnvVar('VITE_BACKEND_URL'))
}