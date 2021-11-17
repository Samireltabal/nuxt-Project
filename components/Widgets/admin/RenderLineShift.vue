<template>
  <div>
    <LineChart :data="barChartData" :options="barChartOptions" :height="200" />
  </div>
</template>
<script>
import LineChart from '../../Charts/LineChart'
export default {
  name: 'RenderLineShift',
  components: {
    LineChart
  },
  props: {
    keys: {
      required: true,
      type: [Array, Object]
    },
    values: {
      required: true,
      type: [Array, Object]
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
  computed: {
    barChartData () {
      return {
        labels: this.keys,
        datasets: [
          {
            label: 'Sales',
            data: this.values,
            backgroundColor: this.color
          }
        ]
      }
    }
  }
}
</script>
