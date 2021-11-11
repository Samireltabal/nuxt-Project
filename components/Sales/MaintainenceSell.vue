<template>
  <v-layout>
    <v-row>
      <v-col>
        <addrecord-form :states="statesItems" />
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import AddrecordForm from '../Maintenance/AddrecordForm.vue'
export default {
  components: {
    AddrecordForm
  },
  data () {
    return {
      statesItems: []
    }
  },
  mounted () {
    this.fetchStates()
  },
  methods: {
    fetchStates () {
      this.$axios.get('/maintenance/state').then((response) => {
        this.statesItems = response.data
      })
    }
  }
}
</script>
