<template>
  <div>
    <LineChart v-if="showLine" :data="barChartData" :options="barChartOptions" :height="200" />
  </div>
</template>
<script>
import LineChart from '../../Charts/LineChart'
export default {
  name: 'RenderLine',
  components: {
    LineChart
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
            backgroundColor: this.color
          }
        ]
      }
    }
  }
}
</script>
