/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'
import type { UserRole } from './roleMode'

type UserRoleContextValue = {
  userRole: UserRole
  setUserRole: Dispatch<SetStateAction<UserRole>>
}

const UserRoleContext = createContext<UserRoleContextValue | null>(null)

export function UserRoleProvider({
  children,
  value,
}: {
  children: ReactNode
  value: UserRoleContextValue
}) {
  return <UserRoleContext.Provider value={value}>{children}</UserRoleContext.Provider>
}

export function useUserRole() {
  const context = useContext(UserRoleContext)
  if (!context) {
    throw new Error('useUserRole must be used within a UserRoleProvider')
  }

  return context.userRole
}

export function useSetUserRole() {
  const context = useContext(UserRoleContext)
  if (!context) {
    throw new Error('useSetUserRole must be used within a UserRoleProvider')
  }

  return context.setUserRole
}
