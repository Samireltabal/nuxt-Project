<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        color="red lighten-2"
        dark
        x-small
        class="mt-2 mx-5"
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-plus</v-icon> ملاحظات
      </v-btn>
    </template>

    <v-card>
      <v-card-title class="text-h5 grey lighten-2">
        إضافة ملاحظات
      </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="note"
          label="ملاحظات"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          color="success"
          @click="submitNote"
        >
          إضافة
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AddEvent',
  props: {
    eventId: {
      required: true,
      type: Number
    }

  },
  data () {
    return {
      dialog: false,
      note: ''
    }
  },
  methods: {
    submitNote () {
      this.$axios.post(`/maintenance/event/${this.eventId}`, { note: this.note }).then(() => {
        this.note = ''
        this.dialog = false
        this.$emit('dataChanged')
        this.$toast.success('تم الإضافة بنجاح')
      }).catch(() => {
        this.$toast.error('خطأ في الإضافة')
      })
    }
  }
}
</script>
