// https://vike.dev/config
export default {
  meta: {
    Layout: {
      env: { server: true, client: true }
    },
    onBeforeRender: {
      env: { server: true, client: true }
    }
  }
}
