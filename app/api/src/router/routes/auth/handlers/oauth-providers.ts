import { createAuth } from '#/api/src/middleware'

export const getGoogleUser = async (env: Env, code: string) => {
  const { googleAuth } = await createAuth(env)
  const { getExistingUser, googleUser, createUser, googleTokens } =
    await googleAuth.validateCallback(code)
  const existingUser = await getExistingUser()
  if (existingUser) return existingUser
  const user = await createUser({
    attributes: {
      username: googleUser.sub,
      email: googleUser.email,
      name: googleUser.name,
      avatar_url: googleUser.picture
      // user_type_flags: arrayToUserTypeFlags([UserType.Credentials]),
    }
  })
  return user
}
