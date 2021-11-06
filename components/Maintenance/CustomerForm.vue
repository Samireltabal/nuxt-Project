<template>
  <v-row>
    <v-col cols="12">
      <v-expand-transition>
        <v-row>
          <v-col cols="12">
            <v-combobox
              v-model="phone"
              :items="items"
              :search-input.sync="search"
              dense
              hide-no-data
              item-text="phone"
              label="رقم موبايل العميل"
              placeholder="إبدأ بكتابة رقم موبايل العميل"
              :prepend-icon="newitem ? 'mdi-account-plus' : 'mdi-account-search'"
              return-object
              hint="قم بكتابة رقم العميل"
              filled
              outlined
              persistent-hint
              clearable
              solo
            />
          </v-col>
          <v-col v-if="newitem" cols="12">
            <v-text-field
              v-model="name"
              label="إسم العميل"
              outlined
              solo
              prepend-icon="mdi-account"
              filled
              dense
            />
          </v-col>
          <v-col v-if="newitem" cols="12">
            <v-select
              v-model="gender"
              label="نوع العميل"
              :items="['male', 'female']"
              outlined
              solo
              prepend-icon="mdi-account"
              filled
              dense
            />
          </v-col>
          <v-col v-if="newitem" cols="12">
            <v-btn block class="rounded-0" color="success" @click="SubmitNewDevice">
              إضافة <v-icon>mdi-database-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-expand-transition>
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: '',
  data () {
    return {
      isLoading: false,
      search: null,
      addRecord: false,
      newitem: false,
      name: null,
      phone: null,
      entries: []
    }
  },
  computed: {
    fields () {
      if (!this.device) { return [] }
      return Object.keys(this.phone).map((key) => {
        return {
          key,
          value: this.phone(key) || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description = entry.name
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      if (this.items.length > 0) { return }

      // Items have already been requested
      if (this.isLoading) { return }

      this.isLoading = true

      // Lazily load input items
      this.$axios.post('profiles/search', { search: val })
        .then((res) => {
          this.entries = res.data
        })
        .finally(() => (this.isLoading = false))
    },
    phone (val) {
      if (typeof val === 'object') {
        this.newitem = false
      } else if (typeof val === 'string') {
        this.newitem = true
      }
      this.$emit('customer-fetched', this.phone)
    }
  },
  methods: {
    SubmitNewDevice () {
      const data = {
        name: this.name,
        phone: this.phone,
        gender: this.gender
      }
      this.$axios.post('/profiles/customer', data).then((response) => {
        this.$emit('customer-fetched', response.data)
        this.newitem = false
      })
    }
  }
}
</script>
