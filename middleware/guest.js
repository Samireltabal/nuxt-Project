const authentication = ({ store, redirect }) => {
  if (store.$auth.loggedIn) {
    return redirect('/dashboard')
  }
}

export default authentication
