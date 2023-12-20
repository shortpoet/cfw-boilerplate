import { LuciaAuthInstance, UserUnion, SessionUnion, LoginOptions } from '#/types';
import { InjectionKey, ref, provide, inject } from 'vue';
import { useFetch } from './fetch';
import { useAuthStore } from '../stores';
import { storeToRefs } from 'pinia';

export {
  LUCIAAUTH_COOKIES_SESSION_TOKEN,
  // LUCIAAUTH_COOKIES_USER_TOKEN,
  LUCIAAUTH_SESSION_TOKEN_EXPIRY,
  useLuciaAuth,
};

const AuthSymbol: InjectionKey<LuciaAuthInstance> = Symbol();

const user = ref<UserUnion>();
const session = ref<SessionUnion | undefined>();
const token = ref<string>();
const authLoading = ref(true);
const error = ref<any>();
const isLoggedIn = ref(false);
const audience = `https://ssr.shortpoet.com`;
const scope = 'openid profile email offline_access';
const response_type = 'code';

// const LUCIAAUTH_COOKIES_USER_TOKEN = `${process.env.VITE_APP_NAME}-next-user-token`;
const LUCIAAUTH_COOKIES_SESSION_TOKEN = `auth_session`;
const LUCIAAUTH_SESSION_TOKEN_EXPIRY = 60 * 60; // 1 hour

export const provideLuciaAuth = () => {
  const auth = {
    user,
    authLoading,
    isLoggedIn,
    authError: error,
    session,

    onLoad: async () => {},
    login: async () => {},
    logout: async () => {},
    setSession: async () => ({}) as SessionUnion,
    setSessionAuthStore: async () => {},
    setAccessToken: async () => {},
    setSessionToken: async () => {},
    setLoggedIn: async () => {},
    setCurrentUser: async () => {},
  };

  provide(AuthSymbol, auth);
};

const useLuciaAuth = () => {
  const auth = inject(AuthSymbol);
  if (!auth) throw new Error('provideAuth() not called in parent');

  const authStore = useAuthStore();
  const {
    authState,
    isLoggedIn,
    nonce,
    idToken,
    accessToken,
    currentUser,
    loginRedirectPath,
    sessionToken,
  } = storeToRefs(authStore);
  const {
    initRandomAuthState,
    initRandomNonce,
    setIdToken,
    setLoggedIn,
    setCurrentUser,
    setAccessToken,
    setSessionToken,
    setNonce,
    setAuthState,
    setLoginRedirectPath,
    setSession: setSessionAuthStore,
  } = authStore;
  setNonce(nonce.value !== '' ? nonce.value : initRandomNonce());
  setAuthState(authState.value !== '' ? authState.value : initRandomAuthState());
  auth.authState = ref(authStore.authState);
  auth.nonce = ref(authStore.nonce);
  auth.isLoggedIn = isLoggedIn;
  auth.idToken = idToken;
  auth.accessToken = accessToken;
  auth.sessionToken = sessionToken;
  auth.user = currentUser;
  auth.loginRedirectPath = loginRedirectPath;
  auth.setIdToken = setIdToken;
  auth.setLoggedIn = setLoggedIn;
  auth.setCurrentUser = setCurrentUser;
  auth.setAccessToken = setAccessToken;
  auth.setSessionToken = setSessionToken;
  auth.setNonce = setNonce;
  auth.setAuthState = setAuthState;
  auth.setLoginRedirectPath = setLoginRedirectPath;
  auth.setSessionAuthStore = setSessionAuthStore;
  // console.log(`authStore: ${JSON.stringify(authStore, null, 2)}`);

  const onLoad = async () => {
    // const sessionCookie = getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN);
    // if (sessionCookie) {
    //   const session = await auth.setSession(sessionCookie);
    // }
    authLoading.value = false;
    // const correlationId = getCookie(X_CORRELATION_ID);
  };

  const setSession = async (
    _session?: SessionUnion | string
  ): Promise<SessionUnion | undefined> => {
    if (!_session) {
      auth.setSessionToken('');
      auth.setLoggedIn(false);
      auth.setSessionAuthStore(null);
      auth.setCurrentUser(null);
      return;
    }
    let session;
    if (typeof _session === 'string') {
      session = await useSession(_session);
    }
    if (!session) return;
    console.log(`[ui] [useAuth] [setSession] -> session ->`);
    console.log(session);
    auth.setCurrentUser(session.user);
    auth.setSessionToken(session.sessionId);
    auth.setLoggedIn(true);
    auth.setSessionAuthStore(session);
    return session;
  };

  const login = async (opts: LoginOptions) => {
    const { urlBaseApi } = useBaseUrl();
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/login/${opts.provider}`);
    console.log(`[ui] [useAuth] login url: ${url.href}`);
    const { data, error, dataLoading } = await useFetch<{ url: string }>(url.href, {
      // headers: {
      //   cookie: `${LUCIAAUTH_COOKIES_SESSION_TOKEN}=${sessionToken.value}`,
      // },
    });
    const { logger, correlationId } = useSsrLogger();

    if (error.value) {
      logger.error(`[ui] [useAuth] error:`);
      logger.error(error.value);
    }
    if (dataLoading.value) {
      logger.info(`[ui] [useAuth] dataLoading: ${dataLoading.value}`);
    }
    if (data.value) {
      logger.debug(`[ui] [useAuth] data: ${JSON.stringify(data.value, null, 2)}`);
      window.location.replace(data.value.url);
    }
  };

  const logout = async () => {
    const { urlBaseApi } = useBaseUrl();
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/logout`);
    const { data, error, dataLoading } = await useFetch<{ url: string }>(url.href, {
      sessionToken: auth.sessionToken?.value,
    });
    if (error.value) {
      console.error(`error: ${error.value}`);
    }

    if (dataLoading.value) {
      console.log(`dataLoading: ${dataLoading.value}`);
    }
    if (data.value) {
      console.log(`data: ${JSON.stringify(data.value, null, 2)}`);
      auth.setSession();
      window.location.replace('/');
    }
  };

  auth.onLoad = onLoad;
  auth.login = login;
  auth.logout = logout;
  auth.setSession = setSession;
  return auth;
};
