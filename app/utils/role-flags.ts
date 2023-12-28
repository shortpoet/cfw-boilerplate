import { UserRole } from '#/types'

type RoleFlags = {
  [key in UserRole]: number
}

/**
 * An object containing the bitwise values for permission-based roles.
 */
export const roleFlags: RoleFlags = {
  not_set: 0,
  user: 1 << 0,
  admin: 1 << 1,
  guest: 1 << 2
}

/**
 * Converts a role flags integer to an array of role names.
 * @param roleFlagsInt - The role flags integer to convert.
 * @returns An array of role names.
 */
export const roleFlagsToArray = (roleFlagsInt: number): UserRole[] => {
  const roles: UserRole[] = []

  for (const [role, flag] of Object.entries(roleFlags)) {
    if (typeof flag === 'number' && roleFlagsInt & flag) {
      roles.push(role as UserRole)
    }
  }

  return roles
}

/**
 * Converts an array of role names to a role flags integer.
 * @param roles - An array of role names.
 * @returns A role flags integer.
 */
export const arrayToRoleFlags = (roles: UserRole[]): number => {
  let combinedFlags = 0

  for (const role of roles) {
    if (role in roleFlags) {
      combinedFlags |= roleFlags[role]
    }
  }

  return combinedFlags
}
