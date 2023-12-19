import {
  BaseUser,
  LuciaAuthInstance,
  Session,
  SetSessionResult,
  User,
  isCredentialsUser,
  isEmailUser,
  isGithubUser,
  UserUnion,
  SessionUnion,
  LoginOptions,
} from '#/types';
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

    login: async () => {},
    logout: async () => {},
    onLoad,
    isGithubUser,
    isEmailUser,
    isCredentialsUser,
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
    setSession: setSessionStore,
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
  auth.setSessionStore = setSessionStore;
  // console.log(`authStore: ${JSON.stringify(authStore, null, 2)}`);

  const sessionCookie = getCookie(LUCIAAUTH_COOKIES_SESSION_TOKEN);
  if (sessionCookie) {
    auth.setSessionToken(sessionCookie);
    auth.setLoggedIn(true);
  }
  // const correlationId = getCookie(X_CORRELATION_ID);

  const setSession = async (): Promise<SetSessionResult> => {
    // TODO set session type
    const { urlBaseApi } = useBaseUrl();
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/session`);
    const { data, error, dataLoading } = await useFetch<any>(url.href);
    let res: SetSessionResult = { session: undefined, status: 'Loading' };
    if (error.value) {
      // if (process.env.VITE_LOG_LEVEL === 'debug')
      console.error(`[ui] useAuth.setSession error: ${error.value}`);
      res = { session: undefined, status: 'Error' };
    }
    if (dataLoading.value) {
      // if (process.env.VITE_LOG_LEVEL === 'debug')
      console.log(`[ui] useAuth.setSession dataLoading: ${dataLoading.value}`);
    }
    if (data.value) {
      console.log(`[ui] useAuth.setSession data: ${JSON.stringify(data.value, null, 2)}`);
      res = { session: data.value, status: 'Success' };
    }
    return res;
  };

  const login = async (opts: LoginOptions) => {
    let res;
    const { urlBaseApi } = useBaseUrl();
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/login/${opts.provider}`);
    console.log(`[ui] [useAuth] login url: ${url.href}`);
    const { data, error, dataLoading } = await useFetch(url.href, {
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
      res = { result: 'Loading', status: 'Loading' };
    }
    if (data.value) {
      logger.debug(`[ui] [useAuth] data: ${JSON.stringify(data.value, null, 2)}`);
      res = { result: 'Success', status: 'Success' };
    }
    console.log(data.value);
    // @ts-ignore
    window.location.replace(data.value.url);
    // auth.setCurrentUser(data.value.user);
  };

  const logout = async () => {
    let res;
    const { urlBaseApi } = useBaseUrl();
    const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/logout`);
    const { data, error, dataLoading } = await useFetch(url.href, {
      sessionToken: auth.sessionToken?.value,
    });
    window.location.replace(url.href);
    // navigate(url.pathname);
    if (error.value) {
      console.error(`error: ${error.value}`);
    }

    if (dataLoading.value) {
      console.log(`dataLoading: ${dataLoading.value}`);
      res = { result: 'Loading', status: 'Loading' };
    }
    if (data.value) {
      console.log(`data: ${JSON.stringify(data.value, null, 2)}`);
    }
  };

  auth.login = login;
  auth.logout = logout;
  auth.setSession = setSession;
  return auth;
};
const onLoad = async () => {
  // this conflicts with getSession on server side and causes a mini redirect loop/series of unnecessary fetches
  // const _session = await setSession();
  // if (_session.status === 'Success') {
  //   console.log(`_session: ${JSON.stringify(_session, null, 2)}`);
  //   session.value = _session.session;
  // }
  authLoading.value = false;
  return null;
};
