<template>
  <v-layout app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3>الحسابات</h3>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="posts.data"
            item-key="name"
            hide-default-footer
            class="elevation-1"
          >
            <template #[`top`]>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="search"
                    prepend-icon="mdi-magnify"
                    label="بحث"
                    hint="بحث برقم المحمول , الاسم او البريد الالكتروني"
                    persistent-hint
                    class="mx-4"
                  />
                </v-col>
                <v-col cols="2">
                  <v-btn class="ma-2" @click="$fetch">
                    <v-icon>mdi-refresh</v-icon> تحديث
                  </v-btn>
                </v-col>
                <v-col cols="2">
                  <v-checkbox v-model="verified_only" label="المفعلين فقط" />
                </v-col>
              </v-row>
            </template>
            <template #[`item.photo`]="{ item }">
              <v-avatar>
                <v-img :src="item.avatar" :alt="item.name" />
              </v-avatar>
            </template>
            <template #[`item.options`]="{ item }">
              <v-btn fab color="error" x-small>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-btn fab color="success" x-small :disabled="item.email_verified_at != null" @click="verify(item.id)">
                <v-icon>mdi-email-check</v-icon>
              </v-btn>
              <v-menu
                rounded
                offset-y
              >
                <template #activator="{ on: menu, attrs }">
                  <v-tooltip bottom>
                    <template #activator="{ on: tooltip }">
                      <v-btn
                        color="success"
                        :disabled="user.id === item.id"
                        fab
                        x-small
                        v-bind="attrs"
                        v-on="{ ...tooltip, ...menu }"
                      >
                        <v-icon>mdi-account-alert</v-icon>
                      </v-btn>
                    </template>
                    <span>ترقية الحساب</span>
                  </v-tooltip>
                </template>
                <v-list>
                  <v-list-item
                    v-for="role in roles"
                    :key="role.name"
                    link
                    @click="attachRole(item.id, role.name)"
                  >
                    <v-list-item-title v-text="role.name" />
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>
            <template #[`body.append`]>
              <tr>
                <td>
                  &nbsp;
                </td>
                <td>
                  tester
                </td>
                <td colspan="4">
                  &nbsp;
                </td>
              </tr>
            </template>
            <template #[`footer`]>
              <v-row>
                <v-col cols="9">
                  <v-pagination
                    v-model="page"
                    :length="posts.last_page"
                    prev-icon="mdi-menu-left"
                    next-icon="mdi-menu-right"
                  />
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="per_page"
                    :items="[1,5,10,50,100]"
                    label="عدد النتائج في الصفحة"
                  />
                </v-col>
              </v-row>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Accounts',
  layout: 'admin',
  middleware: ['admin'],
  data: () => ({
    posts: [],
    roles: [],
    search: null,
    verified_only: false,
    headers: [
      { text: '#', value: 'photo' },
      { text: 'id', value: 'id' },
      { text: 'name', value: 'name' },
      { text: 'phone', value: 'phone' },
      { text: 'email', value: 'email' },
      { text: 'Role', value: 'role' },
      { text: 'options', value: 'options' }
    ]
  }),
  async fetch () {
    this.posts = []
    const uri = `admin/accounts?search=${this.search}&per_page=${this.per_page}&verified=${this.verified_only}&page=${this.page}`
    this.posts = await this.$axios.$get(uri)
    this.roles = await this.$axios.$get('auth/roles')
  },
  computed: {
    page: {
      get () {
        return parseInt(this.$route.query.page) ? parseInt(this.$route.query.page) : parseInt(1)
      },
      set (val) {
        this.$router.replace({ query: { page: val, per_page: this.per_page } })
      }
    },
    per_page: {
      get () {
        return parseInt(this.$route.query.per_page) ? parseInt(this.$route.query.per_page) : parseInt(10)
      },
      set (val) {
        this.$router.replace({ query: { per_page: val, page: this.page } })
      }
    },
    user () {
      return this.$store.state.auth.user
    }
  },
  watch: {
    search () {
      this.$fetch()
    },
    page () {
      this.$fetch()
    },
    per_page () {
      this.$fetch()
    },
    verified_only () {
      this.$fetch()
    }
  },
  methods: {
    attachRole (id, role) {
      const data = {
        user_id: id,
        role_name: role
      }
      this.$toast.success(`Syncing Role ${role} for user id : ${id}`)
      this.$axios.post('/auth/roles/attach', data).then((response) => {
        this.$toast.success(response.data.message)
      }).finally(() => {
        this.$fetch()
      })
    },
    verify (id) {
      const data = {
        user_id: id
      }
      this.$axios.post('/admin/accounts/verify', data).then((response) => {
        this.$toast.success(response.data.message)
      }).finally(() => {
        this.$fetch()
      })
    }
  }
}
</script>
