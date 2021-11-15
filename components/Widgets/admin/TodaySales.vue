<template>
  <v-card
    class="mx-auto text-center"
    color="indigo"
    dark
    max-width="600"
  >
    <v-card-text>
      <v-sheet color="rgba(0, 0, 0, .12)">
        <v-sparkline
          :labels="report.keys"
          :value="report.values"
          :auto-draw="true"
          :auto-draw-duration="1000"
          :show-labels="true"
          color="rgba(255, 255, 255, .7)"
          height="200"
          padding="24"
          stroke-linecap="round"
          smooth
        >
          <template #label="item">
            {{ report.values[item.index] }}EGP | {{ item.value }}:00
          </template>
        </v-sparkline>
      </v-sheet>
    </v-card-text>
    <v-card-text>
      <div>
        <h2>مبيعات اليوم</h2>
      </div>
    </v-card-text>

    <v-divider />

    <v-card-actions class="justify-center">
      <v-btn
        block
        text
      >
        إذهب للتفاصيل
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  name: 'TodaySales',
  data () {
    return {
      report: {}
    }
  },
  mounted () {
    this.get_report()
  },
  methods: {
    get_report () {
      this.$axios.get('/admin/reports/today').then((response) => {
        this.report = response.data
      })
    }
  }
}
</script>
