export {
  Session,
  EmailUser,
  GithubUser,
  CredentialsUser,
  User,
  BaseUser,
  SessionUnion,
  UserUnion,
  AuthInstance,
  LoginOptions,
};

type ISODateString = string;

type SessionUnion = GithubSession | EmailSession | CredentialsSession;
type UserUnion = EmailUser | GithubUser | CredentialsUser | BaseUser;
type User = UserUnion;

interface Session {
  sessionId: string;
  user: UserUnion;
  activePerdiodExpiresAt: ISODateString;
  idlePerdiodExpiresAt: ISODateString;
  state: string;
  fresh: boolean;
}

export enum UserType {
  _ = 'not_set',
  Email = 'email',
  GitHub = 'github',
  Credentials = 'credentials',
}

export enum UserRole {
  _ = 'not_set',
  Guest = 'guest',
  Admin = 'admin',
  User = 'user',
}

type BaseUser = {
  id: string;
  userId: string;
  roles: UserRole[];
};

type GithubSession = {
  sessionId: string;
  user: UserUnion;
  activePerdiodExpiresAt: ISODateString;
  idlePerdiodExpiresAt: ISODateString;
  state: string;
  fresh: boolean;
};

type GithubUser = {
  id: string;
  userId: string;
  roles: UserRole[];
  githubUserName: string;
  userType: UserType.GitHub;
};

type CredentialsUser = {
  id: string;
  userId: string;
  roles: UserRole[];
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  userType: UserType.Credentials;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
  passwordHash?: string;
};

type CredentialsSession = {
  sessionId: string;
  user: UserUnion;
  activePerdiodExpiresAt: ISODateString;
  idlePerdiodExpiresAt: ISODateString;
  state: string;
  fresh: boolean;
};

type EmailUser = {
  id: string;
  userId: string;
  roles: UserRole[];
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  userType: UserType.Email;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
  passwordHash?: string;
};

type EmailSession = {
  sessionId: string;
  user: UserUnion;
  activePerdiodExpiresAt: ISODateString;
  idlePerdiodExpiresAt: ISODateString;
  state: string;
  fresh: boolean;
};

interface AuthInstance {
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
  loginRedirectPath?: Ref<string>;
  // popupOpen: Ref<boolean>;

  onLoad: () => Promise<void>;
  login(options: LoginOptions): Promise<void>;
  logout(options?: any): Promise<void>;
  setSession: (_session: SessionUnion | string) => Promise<SessionUnion | undefined>;
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

type LoginOptions = {
  provider: string;
};
