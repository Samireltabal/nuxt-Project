<template>
  <v-layout app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3>الحسابات</h3>
        </v-col>
        <v-col cols="12">
          <v-text-field v-model="newRole" label="إسم الدور" hint="إسم الدور الذي تود إضافته" />
          <v-btn color="success" @click="addRole">
            <v-icon>mdi-plus</v-icon> إضافة
          </v-btn>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="roles"
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
                <v-col cols="4">
                  <v-btn class="ma-2" block color="indigo" dark @click="$fetch">
                    <v-icon>mdi-refresh</v-icon> تحديث
                  </v-btn>
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
  name: 'Roles',
  layout: 'admin',
  middleware: ['admin'],
  data: () => ({
    newRole: '',
    posts: [],
    roles: [],
    search: null,
    verified_only: false,
    headers: [
      { text: 'id', value: 'id' },
      { text: 'name', value: 'name' }
    ]
  }),
  async fetch () {
    this.roles = []
    this.roles = await this.$axios.$get('auth/roles')
  },
  computed: {
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
    addRole () {
      const data = {
        role_name: this.newRole
      }
      this.$axios.post('/auth/roles/create', data).then(() => {
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
