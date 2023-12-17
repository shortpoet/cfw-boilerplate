// lucia.ts
import { deriveDatabaseAdapter } from '#/api/db/d1-kysely-lucia';
import { lucia, Middleware } from 'lucia';
import 'lucia/polyfill/node';
import { web } from 'lucia/middleware';

// import { google } from '@lucia-auth/oauth/providers';
import { github } from '@lucia-auth/oauth/providers';

const envAliasMap = {
  production: 'PROD',
  development: 'DEV',
} as const;

// const envAlias = envAliasMap[config.env.NODE_ENV];
export const createAuth = async (env: Env) => {
  console.log(`[api] [middleware] [auth] [lucia] [createAuth] -> env: ${env.NODE_ENV}`);
  const adapter = await deriveDatabaseAdapter(env);
  if (!adapter) {
    throw new Error('could not derive database adapter');
  }
  // console.log(`[api] [middleware] [auth] [lucia] -> adapter: ${adapter}`);
  const auth = lucia({
    env: env.NODE_ENV === 'production' ? 'PROD' : 'DEV',
    middleware: web(),
    adapter,
    getUserAttributes: (data) => {
      return {
        githubUsername: data.username,
        name: data.name,
        picture: data.picture,
        email: data.email,
        id: data.id,
        organization_id: data.organization_id,
      };
    },
  });
  console.log(`[api] [middleware] [auth] [lucia] [createAuth] -> auth: ${auth}`);

  const githubAuth = github(auth, {
    clientId: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    redirectUri:
      env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
        ? `http://${env.HOST}:${env.VITE_PORT_API}/api/auth/login/github/callback`
        : `https://${env.HOST}/api/auth/login/github/callback`,
  });

  return { auth, githubAuth };
};

export type Auth = ReturnType<typeof createAuth>;

// export const createGoogleAuth = (auth: Auth, env: Env) => {
//   return google(auth, {
//     redirectUri: `${env.HOST_URL}api/auth/google/callback`,
//     clientId: env.GOOGLE_CLIENT_ID,
//     clientSecret: env.GOOGLE_CLIENT_SECRET,
//   });
// }

// export const createGithubAuth = async (auth: Auth, env: Env) => {
//   return github(auth, {
//     clientId: env.GITHUB_CLIENT_ID,
//     clientSecret: env.GITHUB_CLIENT_SECRET,
//     redirectUri:
//       env.NODE_ENV === 'development' || env.NODE_ENV === 'staging'
//         ? `http://${env.HOST}:${env.VITE_PORT_API}/api/auth/login/github/callback`
//         : `https://${env.HOST}/api/auth/login/github/callback`,
//   });
// };
