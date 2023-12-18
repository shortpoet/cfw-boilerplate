// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';
import { UserRole } from '#/types';
import { Endpoint, PATH_MAPPING, getEndpoints } from './endpoints';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const user = pageContext.session?.user;
  const { urlPathname, csrfToken, sessionToken, callbackUrl } = pageContext;
  console.log(`[ui] [api-data] [onBeforeRender] urlPathname: ${urlPathname}`);
  const pathMapping = PATH_MAPPING;

  const endpoints: Endpoint[] = (await getEndpoints()).reduce((acc, ep) => {
    const { path, title } = ep;
    const route = Object.entries(pathMapping).find(([k, v]) => `/${v.route}` === path)?.[1].route;
    const mappedPath = Object.entries(pathMapping).find(([k, v]) => v.route === route)?.[0];
    // console.log(route);
    // console.log(mappedPath);
    mappedPath ? acc.push({ path: mappedPath, title, route }) : acc.push({ path, title });
    return acc;
  }, [] as Endpoint[]);

  // console.log(`[ui] [api-data] [onBeforeRender] endpoints`);
  // console.log(endpoints);
  return {
    pageContext: {
      pageProps: {
        isAdmin: user?.roles.includes(UserRole.Admin) || false,
        endpoints,
      },
      title: 'API Data',
    },
  };
};