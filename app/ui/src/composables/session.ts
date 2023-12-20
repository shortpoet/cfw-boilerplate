import { SessionUnion } from '#/types';

export const useSession = async (sessionToken: string) => {
  console.log(`[ui] [composables] [session] [useSession] -> sessionToken ->`);
  console.log(sessionToken);
  const { urlBaseApi } = useBaseUrl();
  const { data } = await useFetch<SessionUnion>(`${urlBaseApi}/api/auth/session`, { sessionToken });
  return data.value;
};
