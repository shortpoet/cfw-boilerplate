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

export const getGithubUser = async (env: Env, code: string) => {
  const { githubAuth } = await createAuth(env)
  const { getExistingUser, githubUser, createUser, githubTokens } =
    await githubAuth.validateCallback(code)
  const emailRequest = await fetch('https://api.github.com/user/emails', {
    headers: {
      Authorization: `token ${githubTokens.accessToken}`,
      Accept: 'application/vnd.github.v3+json',
      'User-Agent': 'Lucia',
      'Content-Type': 'application/json',
      'Accept-Encoding': 'gzip, deflate'
    }
  })
  if (!emailRequest.ok) {
    console.log(`[api] [auth] [login] [getGithubUser] -> emailRequest not ok`)
    console.log(emailRequest)
    throw new Error('Unable to fetch email')
  }
  const emails: { email: string; verified: boolean; primary: boolean }[] = await emailRequest.json()
  const verifiedEmail = emails.find((email: any) => email.verified)
  const primaryEmail = emails.find((email: any) => email.primary)
  const primaryVerifiedEmail = emails.find((email: any) => email.primary && email.verified)
  const isVerified = primaryVerifiedEmail || verifiedEmail || primaryEmail
  const existingUser = await getExistingUser()
  if (existingUser) return existingUser
  const user = await createUser({
    attributes: {
      username: githubUser.login,
      email: isVerified ? isVerified.email : undefined,
      name: githubUser.name,
      avatar_url: githubUser.avatar_url
      // user_type_flags: arrayToUserTypeFlags([UserType.Credentials]),
    }
  })
  return user
}
