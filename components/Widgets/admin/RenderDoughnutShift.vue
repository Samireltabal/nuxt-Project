<template>
  <div>
    <DoughnutChart :data="barChartData" :options="barChartOptions" :height="300" />
  </div>
</template>
<script>
import DoughnutChart from '../../Charts/DoughnutChart'
export default {
  name: 'RenderDoughnutShift',
  components: {
    DoughnutChart
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
  computed: {
    barChartData () {
      return {
        labels: this.keys,
        datasets: [
          {
            label: 'Sales',
            data: this.values,
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
