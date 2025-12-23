// Mock for Jest tests
export function getEnvVar(key) {
  return process.env[key]
}

export function isBackendEnabled() {
  return !!(process.env.VITE_BACKEND_URL)
}
