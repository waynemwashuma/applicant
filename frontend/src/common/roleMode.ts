export type UserRole = 'user' | 'reviewer'

const STORAGE_KEY = 'workflow-tracker-user-role'

export function readStoredUserRole(): UserRole {
  if (typeof window === 'undefined') return 'user'

  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'reviewer' ? 'reviewer' : 'user'
}

export function persistUserRole(role: UserRole) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, role)
}
