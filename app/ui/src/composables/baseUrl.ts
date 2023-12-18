export const useBaseUrl = () => {
  const urlBaseApi =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging'
      ? `http://${process.env.HOST}:${process.env.VITE_PORT_API}`
      : `https://${process.env.HOST}`;
  const urlBaseApp =
    process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'staging'
      ? `http://${process.env.HOST}:${process.env.VITE_PORT}`
      : `https://${process.env.HOST}`;
  return { urlBaseApi, urlBaseApp };
};
