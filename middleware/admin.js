const authentication = async ({ store, redirect, $axios }) => {
  await $axios.post('/auth/roles/verify', { role: 'admin' }).then(() => {

  }).catch(() => {
    return redirect('/401')
  })
}

export default authentication
