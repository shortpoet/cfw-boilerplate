import { notFoundResponse, serverErrorResponse } from '#/api/src/middleware'
import { OpenAPIRoute } from '@cloudflare/itty-router-openapi'
import { LuciaError } from 'lucia'
import { AuthVerifyTokenRequestSchema } from '../auth-schema'
import { generateRandomString } from 'lucia/utils'
import { getSession } from './session-handler'
import { redirectResponse } from '#/api/src/middleware/redirect'
import { q } from '#/api/db'
import { sendMail } from './jmap'

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
  const response = await sendMail({
    env,
    messageBody,
    from: env.EMAIL_FROM,
    to: email,
    subject
  })
  console.log(response)
  if (!response) {
    const errors = response
    throw new Error(JSON.stringify(errors, null, 2))
  }
}

export class VerificationTokenGet extends OpenAPIRoute {
  static schema = AuthVerifyTokenRequestSchema

  async handle(req: Request, res: Response, env: Env, ctx: ExecutionContext) {
    try {
      const session = await getSession(req, env)
      if (!session) {
        // Unauthorized
        throw new Error()
      }
      // check if email is already verified
      const reqUrl = new URL(req.url).href
      if (session.user.emailVerified) {
        return redirectResponse(reqUrl, 302, res.headers)
      }

      const code = generateRandomString(8, '0123456789')

      const deleted =
        env.NODE_ENV === 'development'
          ? await q.deleteVerificationCodeLocal(session.user.userId)
          : await q.deleteVerificationCode(session.user.userId)

      const created =
        env.NODE_ENV === 'development'
          ? await q.createVerificationCodeLocal(
              session.user.userId,
              code,
              Date.now() + 1000 * 60 * 5
            )
          : await q.createVerificationCode(session.user.userId, code, Date.now() + 1000 * 60 * 5)

      if (!created || !deleted) {
        return serverErrorResponse('Error creating verification code', undefined, res)
      }

      await sendVerificationRequest({
        env,
        email: session.user.email,
        code
      })
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
