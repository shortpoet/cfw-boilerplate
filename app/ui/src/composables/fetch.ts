import { Ref, UnwrapRef, ref } from 'vue';
import { escapeNestedKeys } from '#/utils';

export { RequestConfig, FetchError, UseFetchResult, useFetch, USE_FETCH_REQ_INIT };

const FILE_DEBUG = true;
const FETCH_DEBUG = import.meta.env.VITE_LOG_LEVEL === 'debug' && FILE_DEBUG;
const IS_SSR = true;
// const IS_SSR = import.meta.env.SSR;

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
  // referrerPolicy?: ReferrerPolicy; // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  // cache?: RequestCache; // *default, no-cache, reload, force-cache, only-if-cached
  // credentials?: RequestCredentials; // include, *same-origin, omit
  // mode?: RequestMode; // no-cors, *cors, same-origin
}

const USE_FETCH_REQ_INIT: RequestConfig = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  redirect: 'follow',
  // referrerPolicy: 'no-referrer',
  // cache: 'no-cache',
  // credentials: 'same-origin',
  // mode: 'cors',
};

interface FetchError extends Error {
  name: string;
  message: string;
  status: number;
  statusText: string;
  error: any;
  stack?: string;
  cause?: any;
}

interface UseFetchResult<T> {
  fetchApi: () => Promise<void>;
  data: Ref<UnwrapRef<T>>;
  dataLoading: Ref<boolean>;
  error: Ref<FetchError | undefined>;
}

const useFetch = async <T>(
  path: string,
  options: RequestConfig = {}
): Promise<UseFetchResult<T>> => {
  const { urlBase } = useBaseUrlApi();
  const url = path.startsWith('http') ? path : `${urlBase}/${path}`;
  const { logger, correlationId } = useSsrLogger();
  logger.info(`[ui] [useFetch] url: ${url}`);
  logger.info(`[ui] [useFetch] correlationId: ${correlationId}`);

  const dataLoading = ref(true);
  const error = ref<FetchError | undefined>();
  const data = ref<T>({} as T);

  const token = ref(options.token || options.session?.accessToken);
  const sessionToken = ref(options.sessionToken);
  const csrfToken = ref(options.csrfToken);
  const callbackUrl = ref(options.callbackUrl);
  const user = ref(options.user);
  // possible leak of private data

  const serverHeaders = {
    'accept-encoding': 'gzip, deflate',
    'accept-language': 'en-US,en;q=0.9',
    connection: 'keep-alive',
    'content-type': 'application/json',
    cookie: `next-auth.session-token=${sessionToken.value}; next-auth.csrf-token=${csrfToken.value}; next-auth.callback-url=${callbackUrl.value};`,
    host: 'localhost:3000',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    origin: `${urlBase}`,
  };

  const headers = IS_SSR
    ? {
        ...USE_FETCH_REQ_INIT.headers,
        ...options.headers,
        ...serverHeaders,
        Authorization: `Bearer ${token.value}`,
        [X_CORRELATION_ID]: correlationId,
        // "X-Ping": "pong",
      }
    : {
        ...USE_FETCH_REQ_INIT.headers,
        ...options.headers,
        Authorization: `Bearer ${token.value}`,
        [X_CORRELATION_ID]: correlationId,
        // "X-Ping": "pong",
      };
  const init = {
    ...USE_FETCH_REQ_INIT,
    ...options,
    headers,
    method: options.body ? 'POST' : 'GET',
  };

  const fetchApi = async () => {
    dataLoading.value = true;

    try {
      const request = new Request(url, init);

      if (FETCH_DEBUG) {
        let logObj = escapeNestedKeys({ ...init }, ['token', 'body', 'Authorization']);
        console.info(
          `[ui] [useFetch] fetching data with init: -> ${JSON.stringify(logObj, null, 2)}`
        );
      }

      const response = await fetch(request, { ...init });

      if (!response.ok) {
        let error = await response.text();
        try {
          error = JSON.parse(error);
        } catch (error) {}
        throw new Error(
          JSON.stringify({
            name: 'FetchError',
            message: `Failed to fetch data from ${url}.`,
            status: response.status,
            statusText: response.statusText,
            error,
          })
        );
      }

      let out;
      const ct = response.headers.get('Content-Type');

      const headers = response.headers;

      console.log('[ui] [useFetch] response headers -> ');
      console.log(headers);
      console.log(headers.get('set-cookie'));

      if (FETCH_DEBUG) {
        (ct === 'application/json' || ct === 'application/x-www-form-urlencoded') &&
          logger.debug(
            `[ui] [useFetch] response: ${JSON.stringify(await response.clone().json(), null, 2)}`
          );
        ct === 'text/plain' &&
          logger.debug(
            `[ui] [useFetch] response: ${JSON.stringify(await response.clone().text())}`
          );
      }

      if (!!out) {
        let error = await response.text();
        try {
          error = JSON.parse(error);
        } catch (error) {}
        throw new Error(
          JSON.stringify({
            name: 'FetchError',
            message: `Failed to parse data from ${url}.`,
            status: response.status,
            statusText: response.statusText,
            error,
          })
        );
      }

      const jsonTypes = [
        'application/json',
        'application/x-www-form-urlencoded',
        'application/json; charset=utf-8',
      ];

      ct && jsonTypes.includes(ct)
        ? (out = await response.json())
        : (out = { text: await response.text() });
      data.value = out;
    } catch (err: any) {
      logger.error(`[ui] [useFetch] error: ${err.message}`);
      console.log(err);
      let message = err.message;
      try {
        message = JSON.parse(err.message);
      } catch (error) {}
      error.value = {
        name: err.name,
        message,
        status: message.status,
        statusText: message.statusText,
        error: message.error,
        stack: err.stack,
        cause: message.message,
      };
    } finally {
      dataLoading.value = false;
    }
  };

  await fetchApi();

  return { fetchApi, data, dataLoading, error };
};
