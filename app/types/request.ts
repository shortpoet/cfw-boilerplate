export { RequestConfig };

interface RequestConfig {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
  redirect?: RequestRedirect;
  withAuth?: boolean;
  token?: string;
  sessionToken?: string;
  csrfToken?: string;
  callbackUrl?: string;
  user?: any;
  session?: any;
  // Cloudflare Error: The 'mode, credentials' field on 'RequestInitializerDict' is not implemented.
  credentials?: RequestCredentials; // include, *same-origin, omit
  // referrerPolicy?: ReferrerPolicy; // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  // cache?: RequestCache; // *default, no-cache, reload, force-cache, only-if-cached
  // mode?: RequestMode; // no-cors, *cors, same-origin
}
