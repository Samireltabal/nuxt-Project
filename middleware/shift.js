// src/middleware/auth.js
// import axios from "../plugins/axios"
// import store from '../store'
export default function shift ({ redirect, $axios, store, route }) {
  $axios.get('/admin/shift/check').then((response) => {
    if (response.data) {
      store.dispatch('handleShift', response.data)
    }
  }).catch(() => {
    if (route.fullPath !== '/login') {
      redirect('/503')
    }
  })
}
