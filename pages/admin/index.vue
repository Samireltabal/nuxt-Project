<template>
  <v-row>
    <v-col class="text-center">
      <today-sales />
    </v-col>
    <v-col>
      <add-expense />
    </v-col>
  </v-row>
</template>
<script>
import AddExpense from '../../components/Admin/addExpense.vue'
import TodaySales from '../../components/Widgets/admin/TodaySales.vue'
export default {
  components: {
    AddExpense,
    TodaySales
  },
  layout: 'admin',
  middleware: 'admin'
}
</script>
