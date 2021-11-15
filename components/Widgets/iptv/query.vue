<template>
  <v-card
    flat
    :loading="isLoading"
    outlined
    tile
  >
    <v-card-title color="indigo">
      <v-row>
        <v-col cols="12">
          إستعلام عن كود
        </v-col>
        <v-col cols="12">
          <v-text-field
            v-model="iptvCode"
            label="كود الاي بي تي في"
          />
        </v-col>
      </v-row>
    </v-card-title>
    <v-expand-transition mode="in-out">
      <v-card-text v-if="resultFound">
        <v-list>
          <v-list-item v-for="(value, key) in code" :key="key">
            {{ key }} : {{ value }}
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-text v-if="errorFound">
        <v-alert color="error" dark>
          {{ error }}
        </v-alert>
      </v-card-text>
    </v-expand-transition>
    <div>
      <v-btn color="success" block class="rounded-0" @click="submitQuery">
        <v-icon>mdi-database-search</v-icon> استعلام
      </v-btn>
      <v-btn color="indigo" block class="rounded-0" dark @click="$router.push('/Sales?tab=tab-3')">
        <v-icon>mdi-database-plus</v-icon> عمل إشتراك جديد
      </v-btn>
      <v-btn color="error" block class="rounded-0" @click="cancelQuery">
        <v-icon>mdi-database-refresh</v-icon> الغاء
      </v-btn>
    </div>
  </v-card>
</template>
<script>
export default {
  name: 'IptvQuery',
  data () {
    return {
      iptvCode: null,
      resultFound: false,
      isLoading: false,
      errorFound: false,
      error: null,
      code: {}
    }
  },
  methods: {
    cancelQuery () {
      this.resultFound = false
      this.isLoading = false
      this.iptvCode = null
      this.item = {}
      this.errorFound = false
      this.error = null
    },
    submitQuery () {
      this.isLoading = true
      this.resultFound = false
      this.code = {}
      this.$axios.post('/pos/iptv/query', { code: this.iptvCode }).then((response) => {
        this.code = response.data
        this.iptvCode = null
        this.isLoading = false
        this.resultFound = true
        this.errorFound = false
        this.error = null
      }).catch((err) => {
        this.errorFound = true
        this.isLoading = false
        this.error = err.response.data.message
      })
    }
  }
}
</script>
