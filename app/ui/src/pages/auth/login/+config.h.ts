// https://vike.dev/config
export default {
  title: 'Auth',
  meta: {
    Layout: {
      env: { server: true, client: true }
    },
    onBeforeRender: {
      env: { server: false, client: true }
    }
  }
}
