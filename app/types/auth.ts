export {
  Session,
  EmailUser,
  GithubUser,
  CredentialsUser,
  User,
  BaseUser,
  SetSessionResult,
  SessionUnion,
  UserUnion,
  AuthInstance,
  LoginOptions,
};

type ISODateString = string;

interface Session {
  id: string;
  userId: string;
  user: UserUnion;
  expires: ISODateString;
  sessionToken: string;
  accessToken: string;
  created: Date;
  updated: Date;
  // sessionType: SessionTypes;
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
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  roles: UserRole[];
  userType: UserType;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
};

type CredentialsUser = {
  id: string;
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  roles: UserRole[];
  userType: UserType.Credentials;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
  passwordHash?: string;
};

type CredentialsSessionUser = {
  email: string;
  emailVerified: Date | string | null;
  roles: UserRole[];
  created_at: Date;
  updated_at: Date;
  name: string | null;
  image?: string | null;
};

type CredentialsSession = {
  user: CredentialsSessionUser;
  expires: Date;
};

type EmailUser = {
  id: string;
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  roles: UserRole[];
  userType: UserType.Email;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
  passwordHash?: string;
};

type EmailSessionUser = {
  email: string;
  emailVerified: Date | string | null;
  roles: UserRole[];
  created_at: Date;
  updated_at: Date;
  name: string | null;
  image?: string | null;
};

type EmailSession = {
  user: EmailSessionUser;
  expires: Date;
};

type GithubSessionUser = {
  email: string;
  emailVerified: Date | string | null;
  roles: UserRole[];
  created_at: Date;
  updated_at: Date;
  name: string | null;
  image?: string | null;
};

type GithubSession = {
  user: GithubSessionUser;
  expires: Date;
};

type GithubUser = {
  id: string;
  email: string;
  emailVerified: Date | string | null;
  name: string | null;
  created_at: Date;
  updated_at: Date;
  roles: UserRole[];
  userType: UserType.GitHub;
  image?: string | null;
  username?: string | null;
  password?: string | null;
  sub?: string;
  nickname?: string;
  picture?: string;
};

type SessionUnion = GithubSession | EmailSession | CredentialsSession;
type UserUnion = EmailUser | GithubUser | CredentialsUser | BaseUser;
type User = UserUnion;

interface SetSessionResult {
  session: SessionUnion | undefined;
  status: 'Loading' | 'Error' | 'Success' | 'Invalid';
}

export function isGithubUser(user: SessionUnion['user']): user is GithubUser {
  console.log(`isGithubUser: ${JSON.stringify(user, null, 2)}`);
  // console.log(`isGithubUser type test: ${user.userType === UserType.GitHub}`);
  console.log(`isGithubUser image defined: ${(user as GithubUser).image !== undefined}`);
  console.log(
    `isGithubUser image is githubusercontent.com: ${
      (user as GithubUser).image?.includes('githubusercontent.com') || false
    }`
  );
  return (
    (user as GithubUser).image !== undefined &&
    ((user as GithubUser).image?.includes('githubusercontent.com') || false)
  );
  // return user.userType === UserType.GitHub;
}

export function isEmailUser(user: SessionUnion['user']): user is EmailUser {
  return (user as EmailUser).roles !== undefined;
  // return user.userType === UserType.Role;
}

export function isCredentialsUser(user: SessionUnion['user']): user is CredentialsUser {
  return (user as CredentialsUser).passwordHash !== undefined;
  // return user.userType === UserType.Credentials;
}

interface AuthInstance {
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
  setNonce?: (nonce: string) => void;
  setAuthState?: (state: string) => void;
  setLoginRedirectPath?: (path: string) => void;
  setIdToken?: (token: string) => void;
  isGithubUser?: (user: UserUnion) => user is GithubUser;
  isEmailUser?: (user: UserUnion) => user is EmailUser;
  isCredentialsUser?: (user: UserUnion) => user is CredentialsUser;
}

type LoginOptions = {
  provider: string;
  sessionToken?: string;
};
