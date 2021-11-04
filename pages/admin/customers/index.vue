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
                    prepend-icon="mdi-account-search"
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
                  <CustomerForm @updated="$fetch()" />
                </v-col>
              </v-row>
            </template>
            <template #[`item.options`]="{ item }">
              <v-btn dark color="error" fab x-small @click="delete_customer(item.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <customer-form :is-customer="true" :customer="item" @updated="$fetch()" />
              <v-btn dark color="indigo" fab x-small @click="$router.push(`/admin/customers/show/${item.uuid}`)">
                <v-icon>mdi-eye</v-icon>
              </v-btn>
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
import CustomerForm from '../../../components/Customers/CustomerForm.vue'
export default {
  name: 'Accounts',
  components: {
    CustomerForm
  },
  layout: 'admin',
  middleware: ['admin'],
  data: () => ({
    posts: [],
    search: null,
    dialog: false,
    headers: [
      { text: 'id', value: 'id' },
      { text: 'name', value: 'name' },
      { text: 'phone', value: 'phone' },
      { text: 'gemder', value: 'gender' },
      { text: 'options', value: 'options' }
    ]
  }),
  async fetch () {
    const uri = `profiles/list?search=${this.search}&per_page=${this.per_page}&page=${this.page}`
    this.posts = await this.$axios.$get(uri)
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
    }
  },
  methods: {
    delete_customer (id) {
      this.$swal.fire({
        title: 'هل انت متأكد ؟',
        text: 'هل انت متأكد من الحذف',
        icon: 'warning',
        showCancelButton: true
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.delete('/profiles/customer', { data: { customer_id: id } }).then((response) => {
            this.$toast.success(response.data.message)
            this.$fetch()
          }).catch((err) => {
            this.$toast.error(err.response.data.message)
            this.$fetch()
          })
        }
      })
    }
  }
}
</script>
