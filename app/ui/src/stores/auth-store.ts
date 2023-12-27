import { acceptHMRUpdate, defineStore } from 'pinia'
import { Session, User } from '#/types'

export const useAuthStore = defineStore('auth', {
  persist: true,
  state: () => ({
    authState: '',
    nonce: '',
    idToken: '',
    accessToken: '',
    sessionToken: '',
    isLoggedIn: false,
    currentUser: undefined as User | undefined,
    loginRedirectPath: '',
    session: undefined as Session | undefined
  }),
  actions: {
    initRandomAuthState() {
      const state = Math.random().toString(36).substring(2)
      this.authState = state
      return state
    },
    initRandomNonce() {
      const nonce =
        Math.random().toString(32).substring(2) + Math.random().toString(32).substring(2)
      this.nonce = nonce
      return nonce
    },
    setIdToken(token: string) {
      this.idToken = token
    },
    setAccessToken(token: string) {
      this.accessToken = token
    },
    setSessionToken(token: string) {
      this.sessionToken = token
    },
    setLoggedIn(loggedIn: boolean) {
      this.isLoggedIn = loggedIn
    },
    setCurrentUser(user: User | undefined) {
      this.currentUser = user
    },
    setNonce(nonce: string) {
      this.nonce = nonce
    },
    setAuthState(state: string) {
      this.authState = state
    },
    setLoginRedirectPath(path: string) {
      this.loginRedirectPath = path
    },
    setSession(session: Session | undefined) {
      console.log('setting session')
      console.log(session)
      this.session = session
    },
    clearState() {
      console.log('clearing auth store state')
      console.log(this)
      this.$reset()
      this.session = undefined
      console.log(this)
      console.log(localStorage.getItem('__persisted__auth'))
      localStorage.removeItem('__persisted__auth')
      console.log(localStorage.getItem('__persisted__auth'))
    }
  }
  // persist: [
  //   { key: "authState", storage: sessionStorage },
  //   { key: "nonce", storage: sessionStorage },
  //   { key: "idToken", storage: sessionStorage },
  //   { key: "accessToken", storage: sessionStorage },
  //   { key: "isLoggedIn", storage: sessionStorage },
  //   { key: "currentUser", storage: sessionStorage },
  // ],
})

// export const useAuthStore = defineStore("auth", () => {
//   console.log("creating auth store");
//   /**
//    * Current state for preventing attacks
//    * https://auth0.com/docs/secure/attack-protection/state-parameters
//    */
//   const savedState = ref("");

//   /**
//    * Changes the current name of the user and saves the one that was used
//    * before.
//    *
//    * @param name - new name to set
//    */
//   function setSavedState(state: string) {
//     savedState.value = state;
//   }

//   function initRandomState() {
//     const state = Math.random().toString(36).substring(2);
//     setSavedState(state);
//   }

//   console.log("auth store created");
//   return {
//     initRandomState,
//     savedState,
//   };
// });

// breaks things
// https://github.com/vuejs/pinia/issues/690
// https://www.reddit.com/r/vuejs/comments/snh25a/cryptic_error_with_pinia_vue_3_typescript/
// https://stackoverflow.com/questions/70681667/cant-use-vue-router-and-pinia-inside-a-single-store
if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
