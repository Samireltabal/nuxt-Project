export default {
  state: () => ({
    isLogged: false,
    cannotConnect: false,
    alertShown: false,
    mqttConnected: false,
    shift_data: { id: 'n/a' },
    shift_validity: false,
    token: '',
    user: {},
    notificationState: false,
    notificationMessage: '',
    isLoading: false
  }),
  mutations: {
    setOffline (state) {
      state.cannotConnect = true
    },
    handleshift (state, obj) {
      state.shift_data = obj.shift
      state.shift_validity = obj.valid
      state.alertShown = !obj.valid
      state.cannotConnect = false
    },
    login (state) {
      state.isLogged = true
    },
    logout (state) {
      state.isLogged = false
    },
    setToken (state, token) {
      state.token = token
    },
    notification (state, message) {
      state.notificationState = true
      state.notificationMessage = message
    },
    closeNotification (state) {
      state.notificationMessage = ''
      state.notificationState = false
    },
    closeAlert (state) {
      state.alertShown = false
    },
    Loading (state, loading) {
      state.isLoading = loading
    },
    setUser (state, user) {
      state.user = user
    },
    clearUser (state) {
      state.user = {}
    },
    mqttState (state, info) {
      state.mqttConnected = info
    }
  },
  actions: {
    handleShift (context, obj) {
      context.commit('handleshift', obj)
    },
    setOffline (context) {
      context.commit('setOffline')
    },
    login (context) {
      context.commit('login')
    },
    updateMqtt (context, state) {
      context.state.mqttConnected = state
    },
    logout (context) {
      context.commit('logout')
      context.commit('clearUser')
    },
    setUser (context, user) {
      context.commit('setUser', user)
    },
    setToken (context, token) {
      context.commit('setToken', token)
    },
    notify (context, message) {
      context.commit('notification', message)
    },
    closeNotification (context) {
      context.commit('closeNotification')
    },
    closeAlert (context) {
      context.commit('closeAlert')
    },
    Loading (context, loading) {
      context.commit('Loading', loading)
    }
  }
}
