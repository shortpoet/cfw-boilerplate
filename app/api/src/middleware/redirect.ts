import { initResponse } from './response';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const redirectUrl = url.searchParams.get('redirectUrl'); // get a query param value (?redirectUrl=...)

    if (!redirectUrl) {
      return new Response('Bad request: Missing `redirectUrl` query param', { status: 400 });
    }

    // The Response class has static methods to create common Response objects as a convenience
    return Response.redirect(redirectUrl, 301);
  },
};

export const redirectResponse = (redirectUrl: string, res?: Response, status = 301) => {
  const init = initResponse(res);
  return new Response(undefined, {
    ...init,
    status,
    headers: {
      ...init.headers,
      Location: redirectUrl,
    },
  });
};
