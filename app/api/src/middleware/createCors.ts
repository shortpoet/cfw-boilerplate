import { IRequest } from 'itty-router';

export type CorsOptions = {
  origins?: string[] | ((origin: string) => boolean);
  maxAge?: number;
  methods?: string[];
  headers?: any;
};

// Create CORS function with default options.
export const createCors = (options: CorsOptions = {}) => {
  // console.log(`[api] [middleware] [createCors] -> `);
  // console.log(options);
  // Destructure and set defaults for options.
  const { origins = ['*'], maxAge, methods = ['GET'], headers = {} } = options;
  console.log(`[api] [middleware] [createCors] -> origins: `);
  console.log(origins);

  let allowOrigin: any;
  const isAllowOrigin =
    typeof origins === 'function'
      ? origins
      : (origin: string) => origins.includes(origin) || origins.includes('*');

  // Initial response headers.
  const rHeaders = {
    'content-type': 'application/json',
    'Access-Control-Allow-Methods': methods.join(', '),
    ...headers,
  };

  // Set max age if provided.
  if (maxAge) rHeaders['Access-Control-Max-Age'] = maxAge;
  console.log(`[api] [middleware] [createCors] -> rHeaders -> `);
  console.log(rHeaders);
  // Pre-flight function.
  const preflight = (r: IRequest) => {
    console.log(`[api] [middleware] [createCors] [preflight] -> `);
    // console.log(r);
    // Use methods set.
    const useMethods = [...new Set(['OPTIONS', ...methods])];
    console.log(`[api] [middleware] [createCors] [preflight] -> headers: `);
    console.log(r.headers);
    const origin = r.headers.get('origin') || '';
    console.log(`[api] [middleware] [createCors] [preflight] -> origin: ${origin}`);
    // set allowOrigin globally
    allowOrigin = isAllowOrigin(origin) && { 'Access-Control-Allow-Origin': origin };

    console.log(`[api] [middleware] [createCors] [preflight] -> allowOrigin: `);
    console.log(allowOrigin);

    // Check if method is OPTIONS.
    if (r.method === 'OPTIONS') {
      const reqHeaders = {
        ...rHeaders,
        'Access-Control-Allow-Methods': useMethods.join(', '),
        'Access-Control-Allow-Headers': r.headers.get('Access-Control-Request-Headers'),
        ...allowOrigin,
      };

      console.log(`[api] [middleware] [createCors] [preflight] -> reqHeaders: `);
      console.log(reqHeaders);
      console.log(`[api] [middleware] [createCors] [preflight] -> r.headers: `);
      console.log(r.headers.get('Origin'));
      console.log(r.headers.get('Access-Control-Request-Headers'));
      console.log(r.headers.get('Access-Control-Request-Method'));

      // Handle CORS pre-flight request.
      return new Response(null, {
        headers:
          r.headers.get('Origin') &&
          r.headers.get('Access-Control-Request-Method') &&
          r.headers.get('Access-Control-Request-Headers')
            ? reqHeaders
            : { Allow: useMethods.join(', ') },
      });
    }
  };

  // Corsify function.
  const corsify = (response: Response): Response => {
    console.log(`[api] [middleware] [createCors] [corsify] -> `);
    // console.log(response);
    if (!response)
      throw new Error('No fetch handler responded and no upstream to proxy to specified.');

    const { headers, status, body } = response;

    // Bypass for protocol shifts or redirects, or if CORS is already set.
    if ([101, 301, 302, 308].includes(status) || headers.get('access-control-allow-origin'))
      return response;

    // Return new response with CORS headers.
    return new Response(body, {
      status,
      headers: {
        ...Object.fromEntries(headers),
        ...rHeaders,
        ...allowOrigin,
        'content-type': headers.get('content-type'),
      },
    });
  };

  // Return corsify and preflight methods.
  return { corsify, preflight };
};
