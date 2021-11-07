<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="indigo lighten-2"
        dark
        x-small
        class="mt-2 mx-5"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon> إضافة قطع غيار
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        إضافة ملاحظات
      </v-card-title>

      <v-card-text>
        <v-combobox
          v-model="model"
          label="قطع الغيار"
          :items="items"
          placeholder="قطع الغيار"
          :search-input.sync="search"
          dense
          item-text="part_name"
          item-value="part_name"
          outlined
          hint="قطع الغيار المستخدمة يدعم البحث"
          persistent-hint
          @change="handleClick()"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          @click="handleClick"
        >
          إضافة
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AddPart',
  props: {
    eventId: {
      required: true,
      type: Number
    },
    recordId: {
      required: true,
      type: Number
    }

  },
  data () {
    return {
      dialog: false,
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
        term: val
      }
      this.$axios.post('/parts/search', data).then((response) => {
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
          part_id: this.model.id,
          event_id: this.eventId,
          record_id: this.recordId
        }
        this.$axios.post('maintenance/records/events/part', data).then((response) => {
          this.$emit('dataFetched', response.data)
          this.dialog = false
          this.$emit('dataChanged')
          this.$toast.success('تم الاضافة بنجاح')
        }).catch((err) => {
          this.$toast.error(err.response.data.message)
        })
      }
    }
  }
}
</script>
