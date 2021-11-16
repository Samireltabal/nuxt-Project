<template>
  <div>
    <DoughnutChart v-if="showLine" :data="barChartData" :options="barChartOptions" :height="300" />
  </div>
</template>
<script>
import DoughnutChart from '../../Charts/DoughnutChart'
export default {
  name: 'RenderDoughnut',
  components: {
    DoughnutChart
  },
  props: {
    src: {
      required: true,
      type: [Number, String]
    },
    head: {
      required: true,
      type: [String]
    },
    color: {
      required: true,
      default: '#665191',
      type: String
    }
  },
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
          text: this.head,
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
          ]
        }
      }
    }
  },
  async fetch () {
    this.showLine = false
    this.report = await this.$axios.$get(`${this.src}`)
    this.showLine = true
  },
  computed: {
    barChartData () {
      return {
        labels: this.report.keys,
        datasets: [
          {
            label: 'Sales',
            data: this.report.values,
            backgroundColor: [
              'rgb(255, 99, 132)',
              'rgb(54, 162, 235)',
              'rgb(255, 205, 86)'
            ]
          }
        ]
      }
    }
  }
}
</script>
