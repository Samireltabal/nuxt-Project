const authentication = async ({ store, redirect }) => {
  if (!store.$auth.loggedIn) {
    if (!store.$auth.$storage._state['_token.sso']) {
      return redirect('/login')
    }
    await store.$auth.fetchUser()
  }
}

export default authentication
