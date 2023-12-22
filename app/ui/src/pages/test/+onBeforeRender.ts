// https://vike.dev/onBeforeRender
export { onBeforeRender };

import type { OnBeforeRenderAsync } from 'vike/types';

import { Todo, getTodos } from './todos';

const onBeforeRender: OnBeforeRenderAsync = async (
  pageContext
): ReturnType<OnBeforeRenderAsync> => {
  const { todos } = await getTodos();
  const { urlBaseApi } = useBaseUrl();
  const { data } = await useFetch<Todo[]>(`${urlBaseApi}/api/todos`);
  return {
    pageContext: {
      pageProps: {
        todosProps: todos,
        todosFetchProps: data.value,
      },
      title: 'Test',
    },
  };
};
