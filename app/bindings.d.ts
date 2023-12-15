export {};

import type {
  Request as CFRequest,
  Response as CFResponse,
  D1Database,
  KVNamespace,
} from '@cloudflare/workers-types';
import { AssetManifestType } from '@cloudflare/kv-asset-handler/dist/types';
import { Logger as LoggerType } from 'pino';
export { Component };
export { PageProps };

import type { ComponentPublicInstance } from 'vue';
type Component = ComponentPublicInstance; // https://stackoverflow.com/questions/63985658/how-to-type-vue-instance-out-of-definecomponent-in-vue-3/63986086#63986086
type Page = Component;

import type {
  ResponseCfProperties,
  LogLevel,
  ListOptions,
  User,
  Session,
  UserRole,
  UserType,
  SessionUnion,
} from './types/src';
import { Database } from './db/src';

type Mutable<T> = {
  -readonly [K in keyof T]-?: T[K];
};

declare module 'json2toml';

declare global {
  // const __STATIC_CONTENT: KVNamespace;
  // const __STATIC_CONTENT_MANIFEST: AssetManifestType;
  const CFW_VUE_AI_KV_UI: KVNamespace;
  const CFW_VUE_AI_DB: D1Database;
  const isWorkerEnv: () => void;

  interface Window {
    initialData: [];
  }
  type NodeEnv = {
    [key: string]: any;
  } & {
    ASSETS: {
      fetch: typeof fetch;
    };
  };
  export type Bindings = Record<string, unknown>;
  interface WorkerEnv {
    // APP
    NODE_ENV: 'development' | 'production';
    WORKER_ENVIRONMENT: 'dev' | 'qa' | 'uat' | 'prod';
    VITE_PORT: string;
    VITE_APP_NAME: string;
    VITE_API_VERSION: string;
    VITE_UI_VERSION: string;
    VITE_LOG_LEVEL: LogLevel;
    VITE_APP_URL: string;
    VITE_API_URL: string;
    SSR_BASE_PATHS: string;

    // CLOUDFLARE
    CFW_VUE_AI_UI: KVNamespace;

    __STATIC_CONTENT: KVNamespace;
    __STATIC_CONTENT_MANIFEST: AssetManifestType | string;

    // DB
    CFW_VUE_AI_DB: D1Database;
    CFW_VUE_AI_DB_BINDING_NAME: string;

    // AUTH
    __SECRET__: string;
    NEXTAUTH_URL: string;
    NEXTAUTH_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    JMAP_TOKEN: string;
    EMAIL_SERVER_HOST: string;
    EMAIL_SERVER_PORT: string;
    EMAIL_SERVER_USER: string;
    EMAIL_SERVER_PASSWORD: string;
    EMAIL_FROM: string;

    isWorkerEnv(): void;
    ASSETS: {
      fetch: typeof fetch;
    };
  }

  type Env = WorkerEnv | NodeEnv | NodeJS.ProcessEnv;
  interface CredsAuth {
    sanitizedUser: string;
    user: User;
    token: string;
  }
  interface ReqAuth {
    sanitizedUser: string;
    user: User | any;
    token: string;
  }

  interface Request extends CFRequest {
    readonly method: string;
    readonly url: string;
    readonly headers: Headers;
    params?: Record<string, string>;
    query?: Record<string, string>;
    logger: LoggerType;
    isAuthenticated?: boolean;
    cf?: CFRequest['cf'];
    cf_summary?: Partial<CFRequest['cf']>;
    listOptions?: ListOptions;
    user?: User | null;
    session?: Omit<Database['Session'], 'id'>;
    auth?: ReqAuth | null;
    credsAuth?: CredsAuth | null;
  }

  // interface Response extends Response {}

  interface Response extends CFResponse {
    cf?: ResponseCfProperties;
    webSocket?: WebSocket;
    encodeBody?: 'automatic' | 'manual' | undefined;
    session?: Session | null;
  }
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      WORKER_ENVIRONMENT: 'dev' | 'qa' | 'uat' | 'prod';
      VITE_PORT: string;
      VITE_LOG_LEVEL: LogLevel;
      VITE_APP_NAME: string;
      VITE_API_VERSION: string;
      VITE_UI_VERSION: string;
      VITE_APP_URL: string;
      VITE_API_URL: string;
      SSR_BASE_PATHS: string;
      __SECRET__: string;
      NEXTAUTH_URL: string;
      NEXTAUTH_SECRET: string;
      GITHUB_CLIENT_ID: string;
      GITHUB_CLIENT_SECRET: string;
      JMAP_TOKEN: string;
      EMAIL_SERVER_HOST: string;
      EMAIL_SERVER_PORT: string;
      EMAIL_SERVER_USER: string;
      EMAIL_SERVER_PASSWORD: string;
      EMAIL_FROM: string;
    }

    interface ImportMeta {
      env: {
        NODE_ENV: 'development' | 'production';
        WORKER_ENVIRONMENT: 'dev' | 'qa' | 'uat' | 'prod';
        VITE_PORT: string;
        VITE_APP_NAME: string;
        VITE_API_VERSION: string;
        VITE_UI_VERSION: string;
        VITE_LOG_LEVEL: LogLevel;
        VITE_APP_URL: string;
        VITE_API_URL: string;
        SSR_BASE_PATHS: string;
        __SECRET__: string;
        NEXTAUTH_URL: string;
        NEXTAUTH_SECRET: string;
        GITHUB_CLIENT_ID: string;
        GITHUB_CLIENT_SECRET: string;
        JMAP_TOKEN: string;
        EMAIL_SERVER_HOST: string;
        EMAIL_SERVER_PORT: string;
        EMAIL_SERVER_USER: string;
        EMAIL_SERVER_PASSWORD: string;
        EMAIL_FROM: string;
      };
    }
  }

  type PageProps = Record<string, unknown> & {
    isAdmin?: boolean;
    loading?: boolean;
    session?: Session | null;
    csrfToken?: string;
    callbackUrl?: string;
    cf?: ResponseCfProperties;
    apiData?: any;
    apiDataLoading?: boolean;
    apiDataError?: any;
  };

  namespace Vike {
    interface PageContext {
      Page: Page;
      pageProps?: PageProps;
      urlPathname: string;
      Layout: Component;
      redirectTo?: string;
      config: {
        /** Title defined statically by /pages/some-page/+title.js (or by `export default { title }` in /pages/some-page/+config.js) */
        title?: string;
        description?: string;
      };
      /** Title defined dynamically by onBeforeRender() */
      title?: string;
      // httpResponse: HttpResponse;
      _allPageIds: string[];
      session: SessionUnion | null;
      isAdmin: boolean;
      csrfToken: string;
      callbackUrl: string;
      sessionToken: string;
      pkceCodeVerifier: string;
      cf: ResponseCfProperties;
      abortReason?: {
        message: string;
        notAdmin?: boolean | undefined;
        noSession?: boolean | undefined;
      };
    }
  }
}

declare module '__STATIC_CONTENT_MANIFEST' {
  const content: string;
  export default content;
}

/// <reference types="lucia" />
declare namespace Lucia {
  type Auth = import('lucia').Auth;
  type DatabaseUserAttributes = {
    username: string;
  };
  type DatabaseSessionAttributes = {};
}
