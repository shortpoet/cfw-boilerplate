export const useBaseUrlApi = () => {
  const urlBase =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging'
      ? `http://${process.env.HOST}:${process.env.VITE_PORT_API}`
      : `https://${process.env.HOST}`;
  return { urlBase };
};
