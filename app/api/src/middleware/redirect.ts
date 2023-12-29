import { setHeaders } from './response'

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)
    const redirectUrl = url.searchParams.get('redirectUrl') // get a query param value (?redirectUrl=...)

    if (!redirectUrl) {
      return new Response('Bad request: Missing `redirectUrl` query param', { status: 400 })
    }

    // The Response class has static methods to create common Response objects as a convenience
    return Response.redirect(redirectUrl, 301)
  }
}

export const redirectResponse = (
  redirectUrl: string,
  status = 301,
  headers: Response['headers'] | Record<string, string>
) => {
  const res = setHeaders(Response.redirect(redirectUrl, status), headers)
  console.log(`[api] [redirectResponse] -> res`)
  console.log(res)
  return res
}

export const redirectHtml = (redirectUrl: string, cookie?: string, status = 301) => {
  const html = `
  <!DOCTYPE html>
  <html>
  <head>
  <meta http-equiv="refresh" content="0;URL='${redirectUrl}'"/>
  </head>
  <body><p>Redirecting to <a href="${redirectUrl}">${redirectUrl}</a>.</p></body>
  </html>
  `
  const resp = new Response(html, {
    headers: {
      'content-type': 'text/html;charset=UTF-8'
    },
    status
  })
  if (cookie) resp.headers.set('Set-Cookie', cookie)
  resp.headers.set('Location', redirectUrl)
  return resp
}
