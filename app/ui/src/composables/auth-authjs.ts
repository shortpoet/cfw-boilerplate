import { NextAuthInstance, Session, User } from '#/types';
import { InjectionKey, ref, provide, inject } from 'vue';
import { storeToRefs } from 'pinia';

export {
  AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN,
  AUTHJS_COOKIES_USER_TOKEN,
  AUTHJS_SESSION_TOKEN_EXPIRY,
  useNextAuth,
};

const AuthSymbol: InjectionKey<NextAuthInstance> = Symbol();

const user = ref<User>();
const session = ref<Session | undefined>();
const token = ref<string>();
const authLoading = ref(true);
const error = ref<any>();
const isLoggedIn = ref(false);
const audience = `https://ssr.shortpoet.com`;
const scope = 'openid profile email offline_access';
const response_type = 'code';

const AUTHJS_COOKIES_USER_TOKEN = `${process.env.VITE_APP_NAME}-next-user-token`;
const AUTHJS_COOKIES_AUTHJS_SESSION_TOKEN = `${process.env.VITE_APP_NAME}-next-session-token`;
const AUTHJS_SESSION_TOKEN_EXPIRY = 60 * 60; // 1 hour

export const provideNextAuth = () => {
  const auth = {
    user,
    authLoading,
    isLoggedIn,
    authError: error,
    session,

    login,
    onLoad,
    logout,
    setSession,
  };

  provide(AuthSymbol, auth);
};

const useNextAuth = () => {
  const auth = inject(AuthSymbol);
  if (!auth) throw new Error('provideAuth() not called in parent');

  const authStore = useAuthStore();
  const { authState, isLoggedIn, nonce, idToken, accessToken, currentUser, loginRedirectPath } =
    storeToRefs(authStore);
  const {
    initRandomAuthState,
    initRandomNonce,
    setIdToken,
    setLoggedIn,
    setCurrentUser,
    setAccessToken,
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
  auth.user = currentUser;
  auth.loginRedirectPath = loginRedirectPath;
  auth.setIdToken = setIdToken;
  auth.setLoggedIn = setLoggedIn;
  auth.setCurrentUser = setCurrentUser;
  auth.setAccessToken = setAccessToken;
  auth.setNonce = setNonce;
  auth.setAuthState = setAuthState;
  auth.setLoginRedirectPath = setLoginRedirectPath;
  auth.setSessionStore = setSessionStore;
  // console.log(`authStore: ${JSON.stringify(authStore, null, 2)}`);
  return auth as NextAuthInstance;
};

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

const login = async (options?: any) => {
  let res;
  const { urlBaseApi } = useBaseUrl();
  const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/signin`);
  const { data, error, dataLoading } = await useFetch(url.href);
  window.location.replace(url.href);
  if (error.value) {
    console.error(`error: ${error.value}`);
  }

  if (dataLoading.value) {
    console.log(`[ui] [useAuth] dataLoading: ${dataLoading.value}`);
    res = { result: 'Loading', status: 'Loading' };
  }
  if (data.value) {
    console.log(`data: ${JSON.stringify(data.value, null, 2)}`);
    res = { result: 'Success', status: 'Success' };
    // const { session, user } = data.value;

    // if (process.env.VITE_LOG_LEVEL === 'debug') {
    //   let logObj = escapeNestedKeys({ ...data.value }, [
    //     'token',
    //     'body',
    //     'Authorization',
    //     'accessToken',
    //     'sessionToken',
    //   ]);
    //   console.log(`data: ${JSON.stringify(logObj, null, 2)}`);
    // }
  }
};

const logout = async () => {
  let res;
  const { urlBaseApi } = useBaseUrl();
  const url = new URL(`${urlBaseApi}/${process.env.AUTH_PATH}/signout`);
  const { data, error, dataLoading } = await useFetch(url.href);
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
