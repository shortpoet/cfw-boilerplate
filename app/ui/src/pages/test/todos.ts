export type Todo = {
  id: string;
  title: string;
};
const { urlBaseApi, urlBaseApp } = useBaseUrl();

const serverHeaders = {
  'accept-encoding': 'gzip, deflate',
  'accept-language': 'en-US,en;q=0.9',
  connection: 'keep-alive',
  host: `${urlBaseApp}`,
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  origin: `${urlBaseApi}`,
};

export async function getTodos() {
  const todos = ref<Todo[]>();
  try {
    const url = `${urlBaseApi}/api/todos`;
    console.log(`[ui] [getTodos] url: ${url}`);
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...serverHeaders,
        Accept: 'application/json',
      },
      redirect: 'follow',
      // credentials: 'include',
    });
    // console.log(res);
    if (res.ok) {
      todos.value = await res.json();
      // console.log(todos);
    }
  } catch (error) {
    console.log(error);
  }
  return { todos: todos.value };
}
