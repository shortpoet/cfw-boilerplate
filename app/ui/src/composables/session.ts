export const useSession = async () => {
  const { urlBaseApi } = useBaseUrl();
  const { data } = await useFetch(`${urlBaseApi}/api/auth/session`);
  return data.value;
};
