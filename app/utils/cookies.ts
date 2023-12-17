import { CookieSetOptions } from 'universal-cookie';

const cookieOptions: (mode: 'set' | 'remove', env: Env) => CookieSetOptions = (mode, env) => {
  const COOKIES_USER_TOKEN = `${env.NODE_ENV}-user-token`;
  const COOKIES_SESSION_TOKEN = `${env.NODE_ENV}-session-token`;
  const COOKIE_EXPIRY = 1000 * 60 * 60 * 24;
  // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie/SameSite
  if (env.VITE_LOG_LEVEL === 'debug') {
    console.log('cookieOptions');
  }
  const hostname = new URL(env.VITE_APP_URL).hostname;
  const isLocalhost =
    hostname === 'localhost' || hostname.startsWith('127.0.0.') || hostname.startsWith('192.168.');
  const out = {
    path: '/',
    expires: new Date(Date.now() + COOKIE_EXPIRY),
    maxAge: 60 * 60 * 24,
    domain: hostname,
    sameSite: 'none' as const,
    secure: env.VITE_APP_URL.startsWith('https') && !isLocalhost,
    httpOnly: false,
  };
  if (env.VITE_LOG_LEVEL === 'debug') {
    console.log(out);
  }
  return out;
};
