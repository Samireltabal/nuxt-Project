<template>
  <v-row>
    <v-col class="text-center" cols="6">
      <RenderDoughnut src="/admin/reports/doughnut" head="Sales Per Type" color="#2980b9" />
    </v-col>
    <v-col cols="6">
      <RenderBar src="/admin/reports/today" head="Sales Per Hour" color="#c0392b" />
    </v-col>
    <v-col cols="6">
      <RenderLine src="/admin/reports/today" head="Sales Per Hour" color="#2ecc71" />
    </v-col>
    <v-col cols="6">
      <add-expense />
    </v-col>
  </v-row>
</template>
<script>
import AddExpense from '../../components/Admin/addExpense.vue'
// import TodaySales from '../../components/Widgets/admin/TodaySales.vue'
import RenderLine from '../../components/Widgets/admin/RenderLine.vue'
import RenderBar from '../../components/Widgets/admin/RenderBar.vue'
import RenderDoughnut from '../../components/Widgets/admin/RenderDoughnut.vue'
export default {
  components: {
    AddExpense,
    // TodaySales,
    RenderLine,
    RenderBar,
    RenderDoughnut
  },
  layout: 'admin',
  middleware: 'admin',
  data () {
    return {
      report: {},
      showLine: false,
      barChartOptions: {
        responsive: true,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Sales Per Hour',
          fontSize: 18,
          fontColor: '#6b7280'
        },
        tooltips: {
          backgroundColor: '#17BF62'
        },
        scales: {
          xAxes: [
            {
              gridLines: {
                display: false
              }
            }
          ],
          yAxes: [
            {
              ticks: {
                beginAtZero: true
              },
              gridLines: {
                display: false
              }
            }
          ]
        }
      }
    }
  },
  computed: {
    barChartData () {
      return {
        labels: this.report.keys,
        datasets: [
          {
            label: 'Sales',
            data: this.report.values,
            backgroundColor: '#665191'
          }
        ]
      }
    }
  },
  mounted () {
    this.get_report().then(() => {
      this.showLine = true
    })
  },
  methods: {
    async get_report () {
      await this.$axios.get('/admin/reports/today').then((response) => {
        this.report = response.data
      })
    }
  }
}
</script>
