import { Session } from '#/types'

export const useSession = async (sessionToken?: string): Promise<Session | undefined> => {
  console.log(`[ui] [composables] [session] [useSession] -> sessionToken ->`)
  console.log(sessionToken)
  // if (!sessionToken) return
  const { urlBaseApi } = useBaseUrl()
  const { data } = await useFetch<Session>(`${urlBaseApi}/api/auth/session`)
  // const { data } = await useFetch<Session>(`${urlBaseApi}/api/auth/session`, { sessionToken });
  return data.value
}
