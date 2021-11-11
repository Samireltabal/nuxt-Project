<template>
  <div>
    <v-row>
      <v-col cols="6">
        <v-text-field v-model="name" label="إسم المصروف" />
      </v-col>
      <v-col cols="6">
        <v-text-field v-model="value" label="القيمة" type="number" />
      </v-col>
      <v-col cols="12">
        <v-text-field v-model="description" label="وصف المصروف" counter="200" />
      </v-col>
      <v-col cols="12">
        <v-btn color="success" block class="rounded-0" @click="submitExpense">
          <v-icon>mdi-plus</v-icon> إضافة مصروف
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>
<script>
export default {
  name: 'AddExpense',
  data () {
    return {
      name: '',
      description: '',
      value: 0
    }
  },
  methods: {
    submitExpense () {
      const data = {
        expense_name: this.name,
        expense_description: this.description,
        value: this.value
      }
      this.$axios.post('/admin/expenses/add', data).then(() => {
        this.$toast.success('تمت الإضافة بنجاح')
        this.name = ''
        this.description = ''
        this.value = 0
      }).catch(() => {
        this.$toast.error('فشل في الإضافة')
      })
    }
  }
}
</script>
