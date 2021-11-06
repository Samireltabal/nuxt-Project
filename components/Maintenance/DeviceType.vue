<template>
  <v-row>
    <v-col cols="12">
      <v-row>
        <v-col cols="12">
          <v-combobox
            v-model="device"
            :items="items"
            :search-input.sync="search"
            dense
            hide-no-data
            item-text="device_name"
            label="نوع الجهاز"
            placeholder="إبدأ بكتابة إسم الجهاز"
            :prepend-icon="newitem ? 'mdi-database-plus' : 'mdi-database-search'"
            return-object
            hint="إختار نوع موجود من قبل او اضف نوع جديد"
            filled
            outlined
            persistent-hint
            clearable
            solo
          />
        </v-col>
        <v-col v-if="newitem" cols="12">
          <v-text-field
            v-model="description"
            label="وصف الجهاز"
            outlined
            solo
            prepend-icon="mdi-information"
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
    </v-col>
  </v-row>
</template>
<script>
export default {
  name: 'DeviceType',
  data () {
    return {
      isLoading: false,
      search: null,
      addRecord: false,
      newitem: false,
      description: null,
      device: null,
      entries: []
    }
  },
  computed: {
    fields () {
      if (!this.device) { return [] }
      return Object.keys(this.device).map((key) => {
        return {
          key,
          value: this.device(key) || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description = entry.description
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
      this.$axios.post('maintenance/devices/search')
        .then((res) => {
          this.entries = res.data
        })
        .finally(() => (this.isLoading = false))
    },
    device (val) {
      if (typeof val === 'object') {
        this.newitem = false
      } else if (typeof val === 'string') {
        this.newitem = true
      }
      this.$emit('device-fetched', this.device)
    }
  },
  methods: {
    SubmitNewDevice () {
      const data = {
        device_name: this.device,
        description: this.description
      }
      this.$axios.post('/maintenance/devices', data).then((response) => {
        this.$emit('device-fetched', response.data)
        this.newitem = false
      })
    }
  }
}
</script>
