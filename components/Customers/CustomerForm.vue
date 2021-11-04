<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    hide-overlay
    transition="dialog-bottom-transition"
  >
    <template #activator="{ on, attrs }">
      <v-btn
        v-if="!isCustomer"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account-plus</v-icon> عميل جديد
      </v-btn>
      <v-btn
        v-else
        color="warning"
        dark
        fab
        x-small
        v-bind="attrs"
        v-on="on"
      >
        <v-icon>mdi-account-edit</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        dark
        color="indigo"
      >
        <v-btn
          icon
          dark
          @click="dialog = false"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>إضافة عميل جديد</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn
            dark
            text
            @click="submitForm"
          >
            حفظ
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-list
        three-line
        subheader
      >
        <v-subheader>بيانات العميل</v-subheader>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>الإسم</v-list-item-title>
            <v-list-item-subtitle>
              <v-text-field
                v-model="form.name"
                label="الإسم"
                :error="handleValidationErrors('name').has_error"
                :error-messages="handleValidationErrors('name').has_error ? handleValidationErrors('name').message : ''"
                hint="إسم العميل"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>الإسم</v-list-item-title>
            <v-list-item-subtitle>
              <v-text-field
                v-model="form.phone"
                label="التليفون"
                :error="handleValidationErrors('phone').has_error"
                :error-messages="handleValidationErrors('phone').has_error ? handleValidationErrors('phone').message : ''"
                hint="رقم تليفون العميل"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>الإسم</v-list-item-title>
            <v-list-item-subtitle>
              <v-select
                v-model="form.gender"
                label="النوع"
                :error="handleValidationErrors('gender').has_error"
                :error-messages="handleValidationErrors('phone').has_error ? handleValidationErrors('gender').message : ''"
                hint="نوع العميل"
                :items="['male','female','both']"
              />
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-divider />
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'CustomerForm',
  props: {
    customer: {
      required: false,
      default () {
        return {
          name: null,
          phone: null,
          gender: 'male'
        }
      },
      type: Object
    },
    isCustomer: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      dialog: false,
      form: {},
      genders: [
        'male',
        'female'
      ],
      errors: []
    }
  },
  mounted () {
    this.form = this.customer
  },
  methods: {
    submitForm () {
      if (this.isCustomer) {
        this.$axios.put('/profiles/customer', this.form).then((response) => {
          this.$toast.success('تم التعديل بنجاح')
          this.$emit('updated')
          this.dialog = false
        }).catch((err) => {
          this.$toast.error(err.response.data.message)
        })
      } else {
        this.$axios.post('/profiles/customer', this.form).then((response) => {
          this.$toast.success('تم الإضافة بنجاح')
          this.$emit('updated')
          this.dialog = false
        }).catch((err) => {
          this.errors = err.response.data.errors
          this.$toast.error(err.response.data.message)
        })
      }
    },
    handleValidationErrors (name) {
      const errorData = {
        has_error: this.errors[name] != null,
        message: this.errors[name]
      }
      return errorData
    }
  }
}
</script>
