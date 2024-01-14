export { sendMail }

interface AuthParams {
  headers: {
    'Content-Type': string
    Authorization: string
  }
  authUrl: string
  username: string
}

const getAuthParams = async (env: Env): Promise<AuthParams> => {
  const token = env.JMAP_TOKEN
  const username = env.EMAIL_SERVER_USER
  if (!token || !username) {
    throw new Error('No JMAP token or username found')
  }
  return {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    authUrl: `https://api.fastmail.com/.well-known/jmap`,
    // authUrl: `https://${env.JMAP_HOSTNAME}/.well-known/jmap`,
    username
  }
}

const handleResponse = async (response: Response): Promise<any> => {
  const clone = response.clone()
  try {
    const data: any = await response.json()
    // console.log(`[api] [jmap] [handleResponse] [data] ${JSON.stringify(data, null, 2)}`)
    return data
  } catch (error) {
    console.log(`[api] [jmap] [handleResponse] [error] ${JSON.stringify(error, null, 2)}`)
    console.log(
      `[api] [jmap] [handleResponse] [error] make sure token is valid, and a valid alias exists for the sender`
    )
    const text = await clone.text()
    console.log(`[api] [jmap] [handleResponse] [text] ${text}`)
    return text
  }
}

const getSession = async (authUrl: string, headers: Record<string, string>): Promise<any> => {
  // console.log(`[api] [jmap] [getSession] [authUrl] ${authUrl}`)
  // console.log(`[api] [jmap] [getSession] [headers] ${JSON.stringify(headers, null, 2)}`)
  const response = await fetch(authUrl, {
    method: 'GET',
    headers
  })
  return await handleResponse(response)
}

const mailboxQuery = async (
  apiUrl: string,
  accountId: string,
  headers: Record<string, string>
): Promise<any> => {
  // console.log(`[api] [jmap] [mailboxQuery] [apiUrl] ${apiUrl}`)
  // console.log(`[api] [jmap] [mailboxQuery] [accountId] ${accountId}`)
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      using: ['urn:ietf:params:jmap:core', 'urn:ietf:params:jmap:mail'],
      methodCalls: [['Mailbox/query', { accountId, filter: { name: 'Drafts' } }, 'a']]
    })
  })
  const data = await handleResponse(response)

  return await data['methodResponses'][0][1].ids[0]
}

const identityQuery = async (
  apiUrl: string,
  accountId: string,
  username: string,
  headers: Record<string, string>
): Promise<any> => {
  // console.log(`[api] [jmap] [identityQuery] [apiUrl] ${apiUrl}`)
  // console.log(`[api] [jmap] [identityQuery] [accountId] ${accountId}`)
  // console.log(`[api] [jmap] [identityQuery] [username] ${username}`)
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      using: [
        'urn:ietf:params:jmap:core',
        'urn:ietf:params:jmap:mail',
        'urn:ietf:params:jmap:submission'
      ],
      methodCalls: [['Identity/get', { accountId, ids: null }, 'a']]
    })
  })
  const data: any = await handleResponse(response)

  return await data['methodResponses'][0][1].list.filter(
    (identity: any) => identity.email === username
  )[0].id
}

interface DraftParams {
  apiUrl: string
  accountId: string
  draftId: string
  identityId: string
  username: string
  headers: Record<string, string>
  messageBody?: string
  from?: string
  to?: string
  subject?: string
}

const draftResponse = async ({
  apiUrl,
  accountId,
  draftId,
  identityId,
  username,
  headers,
  messageBody = 'Hi! \n\n' +
    'This email may not look like much, but I sent it with JMAP, a protocol \n' +
    'designed to make it easier to manage email, contacts, calendars, and more of \n' +
    'your digital life in general. \n\n' +
    'Pretty cool, right? \n\n' +
    '-- \n' +
    'This email sent from my next-generation email system at Fastmail. \n',
  from = username,
  to = username,
  subject = 'Hello, world!'
}: DraftParams): Promise<any> => {
  const draftObject = {
    from: [{ email: from }],
    to: [{ email: to }],
    subject,
    keywords: { $draft: true },
    mailboxIds: { [draftId]: true },
    bodyValues: { body: { value: messageBody, charset: 'utf-8' } },
    textBody: [{ partId: 'body', type: 'text/plain' }]
  }

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      using: [
        'urn:ietf:params:jmap:core',
        'urn:ietf:params:jmap:mail',
        'urn:ietf:params:jmap:submission'
      ],
      methodCalls: [
        ['Email/set', { accountId, create: { draft: draftObject } }, 'a'],
        [
          'EmailSubmission/set',
          {
            accountId,
            onSuccessDestroyEmail: ['#sendIt'],
            create: { sendIt: { emailId: '#draft', identityId } }
          },
          'b'
        ]
      ]
    })
  })

  const data = await response.json()
  console.log(JSON.stringify(data, null, 2))
  return data
}

const sendMail = async ({
  env,
  messageBody,
  from,
  to,
  subject
}: {
  env: Env
  messageBody?: string
  from?: string
  to?: string
  subject?: string
}): Promise<any> => {
  const { headers, authUrl, username } = await getAuthParams(env)
  let success = false
  console.log(headers, authUrl, username)
  try {
    const session = await getSession(authUrl, headers)
    if (typeof session === 'string') {
      throw new Error(`No JMAP session found - ${session}`)
    }
    const apiUrl = session.apiUrl
    const accountId = session.primaryAccounts['urn:ietf:params:jmap:mail']
    const draftId = await mailboxQuery(apiUrl, accountId, headers)
    const identityId = await identityQuery(apiUrl, accountId, username, headers)
    const res = await draftResponse({
      apiUrl,
      accountId,
      draftId,
      identityId,
      username,
      headers,
      messageBody,
      from,
      to,
      subject
    })
    success = res.methodResponses[0][1].notCreated === null
    // console.log(res.methodResponses[0])
    // console.log(res.methodResponses[1])
    const timeSent = success ? res.methodResponses[1][1].created.sendIt.sendAt : null
    return { success, timeSent }
  } catch (error) {
    console.log(`[api] [jmap] [sendMail] [error]`)
    console.log(error)
    return { success, error }
  }
}
