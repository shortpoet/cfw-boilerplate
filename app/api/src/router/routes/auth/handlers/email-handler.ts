import {
  createAuth,
  getBaseUrl,
  jsonOkResponse,
  notFoundResponse,
  serverErrorResponse
} from '#/api/src/middleware'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { LuciaError } from 'lucia'
import { AuthVerifyTokenRequestSchema, AuthVerifyTokenSubmitSchema } from '../auth-schema'
import { generateRandomString, isWithinExpiration } from 'lucia/utils'
import { getSession } from './session-handler'
import { redirectResponse } from '#/api/src/middleware/redirect'
import { q, VerificationCodeSchema } from '#/api/db'
import { sendMail } from './jmap'
import { ZodError } from 'zod'

const getMagicLinkBody = (recipient: string, url: string) => `
<p>Hi, ${recipient}!</p>
<p>Please click the link below to verify your email address:</p>
<p><a href="${url}">${url}</a></p>
<p>Thanks,</p>
<p>Your AI Maps Team</p>
`

const getVerificationCodeBody = (recipient: string, code: string) => `
<p>Hi, ${recipient}!</p>
<p>Please enter the following code to verify your email address:</p>
<p><strong>${code}</strong></p>
<p>Thanks,</p>
<p>Your AI Maps Team</p>
`

async function sendVerificationRequest({
  env,
  email,
  url,
  code
}: {
  env: Env
  email: string
  url?: string
  code?: string
}) {
  let recipient = ''
  if (email && email.includes('@')) {
    recipient = email.match(/[^@]+/)![0]
  }

  const messageBody = code
    ? getVerificationCodeBody(recipient, code)
    : url
      ? getMagicLinkBody(recipient, url)
      : undefined

  if (!messageBody) {
    throw new Error('No message body will be generated due to missing parameters')
  }

  const subject = 'Verify your email address'
  const { success, timeSent, error } = await sendMail({
    env,
    messageBody,
    from: env.EMAIL_FROM,
    to: email,
    subject
  })
  if (!success) {
    throw new Error(JSON.stringify(error, null, 2))
  }
  return { timeSent }
}

export class VerificationTokenGet extends OpenAPIRoute {
  static schema = AuthVerifyTokenRequestSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      const reqUrl = new URL(req.url).href
      const session = await getSession(req, env)
      if (!session) {
        // Unauthorized
        throw new Error()
      }
      // check if email is already verified
      if (session.user.emailVerified) {
        return redirectResponse(reqUrl, 302, res.headers)
      }

      console.log('session')
      console.log(session)

      const code = generateRandomString(8, '0123456789')

      const deleted =
        env.NODE_ENV === 'development'
          ? await q.deleteVerificationCodeLocal(session.user.userId)
          : await q.deleteVerificationCode(session.user.userId)

      const created =
        env.NODE_ENV === 'development'
          ? await q.createVerificationCodeLocal(
              code,
              session.user.userId,
              Date.now() + 1000 * 60 * 5
            )
          : await q.createVerificationCode(code, session.user.userId, Date.now() + 1000 * 60 * 5)

      if (!created || !deleted) {
        return serverErrorResponse('Error creating verification code', undefined, res)
      }

      const { timeSent } = await sendVerificationRequest({
        env,
        email: session.user.email,
        code
      })
      return jsonOkResponse({ timeSent })
    } catch (error) {
      console.error(error)
      if (error instanceof LuciaError) {
        console.error(error)
        return notFoundResponse('Token Error', error, res)
      }
      return serverErrorResponse('Error getting session', error, res)
    }
  }
}

export class VerificationTokenPost extends OpenAPIRoute {
  static schema = AuthVerifyTokenSubmitSchema
  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext, data: any) {
    try {
      const verificationTimeout = new Map<
        string,
        {
          timeoutUntil: number
          timeoutSeconds: number
        }
      >()
      const session = await getSession(req, env)

      // prevent brute force by throttling requests
      const storedTimeout = verificationTimeout.get(session.user.userId) ?? null
      if (!storedTimeout) {
        // first attempt - setup throttling
        verificationTimeout.set(session.user.userId, {
          timeoutUntil: Date.now(),
          timeoutSeconds: 1
        })
      } else {
        // subsequent attempts
        if (!isWithinExpiration(storedTimeout.timeoutUntil)) {
          throw new Error('Too many requests')
        }
        const timeoutSeconds = storedTimeout.timeoutSeconds * 2
        verificationTimeout.set(session.user.userId, {
          timeoutUntil: Date.now() + timeoutSeconds * 1000,
          timeoutSeconds
        })
      }
      const { query } = data
      const code = query.token

      const storedVerificationCode = async () => {
        const res =
          env.NODE_ENV === 'development'
            ? await q.getVerificationCodeLocal(code)
            : await q.getVerificationCode(code)
        const result = VerificationCodeSchema.safeParse(res)
        if (!result.success || !result.data || result.data.code !== code) {
          throw new Error('Invalid verification code')
        }
        env.NODE_ENV === 'development'
          ? await q.deleteVerificationCodeLocal(session.user.userId)
          : await q.deleteVerificationCode(session.user.userId)
        return result.data
      }
      const storedVerificationCodeResult = await storedVerificationCode()
      if (!isWithinExpiration(storedVerificationCodeResult.expires)) {
        // optionally send a new code instead of an error
        throw new Error('Expired verification code')
      }

      if (storedTimeout) verificationTimeout.delete(session.user.userId)
      const { auth } = await createAuth(env)

      let user = await auth.getUser(storedVerificationCodeResult.user_id)

      await auth.invalidateAllUserSessions(user.userId) // important!

      user = await auth.updateUserAttributes(user.userId, {
        email_verified: true // verify email
      })

      const newSession = await auth.createSession({
        userId: user.userId,
        sessionId: await res.cryptoSign(generateRandomString(40)),
        attributes: {}
      })

      const sessionCookie = auth.createSessionCookie(newSession).serialize()
      const { baseUrlApp } = getBaseUrl(env)
      const dataPage = new URL(`${baseUrlApp}/api-data`).href
      // await res.cookie(req, res, env, LUCIA_AUTH_COOKIES_SESSION_TOKEN, sessionCookie)
      res.headers.set('Set-Cookie', sessionCookie)
      return jsonOkResponse(dataPage, res)
    } catch (error) {
      console.error(error)
      if (error instanceof LuciaError) {
        console.error(error)
        return notFoundResponse('Token Error', error, res)
      }
      if (error instanceof ZodError) {
        return new Response(JSON.stringify(error), { status: 400 })
      }
      return serverErrorResponse('Error getting session', error, res)
    }
  }
}
