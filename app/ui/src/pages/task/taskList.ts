export const getTaskList = async (page: number) => {
  const { urlBaseApi } = useBaseUrl();
  const url = `${urlBaseApi}/api/task/tasks?page=${page}`;
  console.log(`[ui] [task] [index] [onBeforeRender] fetching url: ${url}`);
  const response = await fetch(url);
  const data = await response.json();
  console.log(`[ui] [task] [index] [onBeforeRender] data:`);
  console.log(data);
  await new Promise((resolve) => {
    setTimeout(() => resolve(true), 1000);
  });
  return ref(data);
};
