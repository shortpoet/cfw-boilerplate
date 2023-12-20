import { Ref } from 'vue';
import {
  AuthInstance,
  CredentialsUser,
  EmailUser,
  GithubUser,
  LoginOptions,
  SessionUnion,
  UserUnion,
} from './auth';

export { LuciaAuthInstance };

export const LUCIA_AUTH_GITHUB_OAUTH_STATE = 'github_oauth_state';
export const LUCIA_AUTH_COOKIES_SESSION_TOKEN = `auth_session`;

interface LuciaAuthInstance extends AuthInstance {
  authLoading: Ref<boolean>;
  authError: Ref<any>;
  isLoggedIn: Ref<boolean>;
  user?: Ref<UserUnion | undefined | null>;
  githubUser?: Ref<GithubUser | undefined>;
  authState?: Ref<string>;
  nonce?: Ref<string>;
  session?: Ref<SessionUnion | undefined>;
  idToken?: Ref<string>;
  accessToken?: Ref<string>;
  sessionToken?: Ref<string>;
  loginRedirectPath?: Ref<string>;
  // popupOpen: Ref<boolean>;

  onLoad: () => Promise<void>;
  login(options: LoginOptions): Promise<void>;
  logout(options?: any): Promise<void>;
  setSession: (_session?: SessionUnion | string) => Promise<SessionUnion | undefined>;
  setSessionAuthStore: (session: SessionUnion | null) => void;
  setSessionToken: (token: string) => void;
  setLoggedIn: (loggedIn: boolean) => void;
  setCurrentUser: (user: UserUnion | null) => void;
  setAccessToken?: (token: string) => void;
  setNonce?: (nonce: string) => void;
  setAuthState?: (state: string) => void;
  setLoginRedirectPath?: (path: string) => void;
  setIdToken?: (token: string) => void;
}
