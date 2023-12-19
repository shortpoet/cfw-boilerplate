import { Ref } from 'vue';
import {
  AuthInstance,
  CredentialsUser,
  EmailUser,
  GithubUser,
  LoginOptions,
  SessionUnion,
  SetSessionResult,
  UserUnion,
} from './auth';

export { LuciaAuthInstance };

export const LUCIA_AUTH_GITHUB_OAUTH_STATE = 'github_oauth_state';
export const LUCIA_AUTH_COOKIES_SESSION_TOKEN = `auth_session`;

interface LuciaAuthInstance extends AuthInstance {
  authLoading: Ref<boolean>;
  authError: Ref<any>;
  isLoggedIn: Ref<boolean>;
  user?: Ref<UserUnion | undefined>;
  githubUser?: Ref<GithubUser | undefined>;
  authState?: Ref<string>;
  nonce?: Ref<string>;
  session?: Ref<SessionUnion | undefined>;
  idToken?: Ref<string>;
  accessToken?: Ref<string>;
  sessionToken?: Ref<string>;
  loginRedirectPath?: Ref<string>;
  // popupOpen: Ref<boolean>;

  onLoad: () => Promise<UserUnion | null | undefined>;
  login(options: LoginOptions): Promise<void>;
  logout(options?: any): Promise<void>;
  setSession?: (user: UserUnion) => Promise<SetSessionResult>;
  setSessionStore?: (session: SessionUnion) => void;
  setLoggedIn?: (loggedIn: boolean) => void;
  setCurrentUser?: (user: UserUnion) => void;
  setAccessToken?: (token: string) => void;
  setSessionToken?: (token: string) => void;
  setNonce?: (nonce: string) => void;
  setAuthState?: (state: string) => void;
  setLoginRedirectPath?: (path: string) => void;
  setIdToken?: (token: string) => void;
  isGithubUser?: (user: UserUnion) => user is GithubUser;
  isEmailUser?: (user: UserUnion) => user is EmailUser;
  isCredentialsUser?: (user: UserUnion) => user is CredentialsUser;
}
