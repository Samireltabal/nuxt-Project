<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-combobox
          v-model="model"
          label="حالة الحهاز"
          :items="items"
          placeholder="حالة الجهاز"
          :search-input.sync="search"
          dense
          item-text="state_name"
          item-value="state_name"
          outlined
          hint="وضع الجهاز الحالي مثال : تم الإستلام , مرفوض"
          persistent-hint
          @change="handleClick()"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
// Returns Search Term On Change
export default {
  name: 'StateBox',
  data () {
    return {
      model: null,
      search: null,
      entries: []
    }
  },
  computed: {
    fields () {
      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        return Object.assign({}, entry)
      })
    }
  },
  watch: {
    search (val) {
      const data = {
        search_term: val
      }
      this.$axios.post('/maintenance/state/search', data).then((response) => {
        this.entries = response.data
      }).finally(() => {
        this.isLoading = false
      })
      this.$emit('termChanged', val)
    }
  },
  methods: {
    handleClick () {
      if (typeof this.model === 'object') {
        const data = {
          state_name: this.model.state_name
        }
        this.$axios.post('maintenance/state', data).then((response) => {
          this.$emit('dataFetched', response.data)
          this.model = response.data
        })
      } else {
        const data = {
          state_name: this.model
        }
        this.$axios.post('maintenance/state', data).then((response) => {
          this.$emit('dataFetched', response.data)
          this.model = response.data
        })
      }
    }
  }
}
</script>
