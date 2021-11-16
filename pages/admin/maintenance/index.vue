<template>
  <v-layout app>
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <v-btn block color="indigo" dark @click="showForm = !showForm">
            إضافة سجل جديد <v-icon>mdi-database-plus</v-icon>
          </v-btn>
          <AddrecordForm v-show="showForm" :states="statesItems" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="5">
          <v-text-field
            v-model="searchTerm"
            label="بحث عن سجل"
            clearable
            prepend-icon="mdi-folder-search"
          />
        </v-col>
        <v-col cols="5">
          <v-select
            v-model="state_id"
            label="حالة الجهاز"
            item-text="state_name"
            item-value="id"
            clearable
            :items="statesItems"
          />
        </v-col>
        <v-col cols="2">
          <v-btn color="indigo" class="mt-2" dark :disabled="!state_id" @click="printReport">
            <v-icon>mdi-printer</v-icon> طباعة تقرير
          </v-btn>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="records.data"
            dense
            disable-sort
            hide-default-footer
            disable-pagination
            :loading="dataLoading"
          >
            <template #[`item.barcode`]="{ item }">
              <v-img
                class="my-2 mx-2"
                :src="item.barcode"
              />
            </template>
            <template #[`item.state.state_name`]="{ item }">
              <v-chip :color="item.state.color" small dark>
                {{ item.state.state_name }}
              </v-chip>
            </template>
            <template #[`item.created_at`]="{ item }">
              {{ $luxon(item.created_at) }}
            </template>
            <template #[`item.options`]="{ item }">
              <v-item-group
                dense
              >
                <v-btn
                  outlined

                  class="ma-1"
                  fab
                  x-small
                  color="primary"
                  @click="showBarcode(item.id)"
                >
                  <v-icon>mdi-barcode</v-icon>
                </v-btn>
                <v-btn
                  class="ma-1"
                  outlined
                  x-small
                  fab
                  color="indigo"
                  @click="$router.push(`/maintenance/show/${item.id}`)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
                <v-btn
                  outlined
                  class="ma-1"
                  x-small
                  fab
                  color="indigo"
                  @click="showA5(item.id)"
                >
                  <v-icon>mdi-printer</v-icon>
                </v-btn>
              </v-item-group>
            </template>
          </v-data-table>
          <div class="text-center pt-2">
            <hr>
            <v-row>
              <v-col cols="9">
                <v-pagination
                  v-model="page"
                  :length="records.last_page"
                  circle
                />
              </v-col>
              <v-col cols="3">
                <v-select v-model="per_page" label="عدد النتائج في الصفحة" :items="[1,5,10,20]" />
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import AddrecordForm from '../../../components/Maintenance/AddrecordForm.vue'
export default {
  name: 'Maintenence',
  components: {
    AddrecordForm
  },
  layout: 'admin',
  data () {
    return {
      device: {},
      records: [],
      items: [],
      page: 1,
      showForm: false,
      dataLoading: true,
      searchTerm: null,
      per_page: 10,
      statesItems: [],
      state_id: null,
      headers: [
        { text: '#', value: 'id' },
        { text: 'اسم العميل', value: 'customer.name' },
        { text: 'رقم العميل', value: 'customer.phone' },
        { text: 'نوع الجهاز', value: 'device.device_name' },
        { text: 'العميل منتظر', value: 'is_waiting' },
        { text: 'الحالة', value: 'state.state_name' },
        { text: 'العطل', value: 'problem' },
        { text: 'كود', value: 'barcode' },
        { text: ' تاريخ انشاء السجل', value: 'created_at' },
        { text: 'خيارات', value: 'options' }
      ]
    }
  },
  async fetch () {
    const uri = `maintenance/records/list?per_page=${this.per_page}&page=${this.page}${this.searchTerm ? '&search=' + this.searchTerm : ''}${this.state_id ? '&state_id=' + this.state_id : ''}`
    this.records = await this.$axios.$get(uri)
    this.dataLoading = false
  },
  watch: {
    searchTerm () {
      this.page = 1
      this.$fetch()
    },
    state_id () {
      this.page = 1
      this.$fetch()
    },
    page () {
      this.$fetch()
      this.$router.replace({ query: { page: this.page, per_page: this.per_page } })
    },
    per_page () {
      this.$fetch()
      this.$router.replace({ query: { page: this.page, per_page: this.per_page } })
    }
  },
  mounted () {
    if (this.$route.query.per_page) {
      this.per_page = parseInt(this.$route.query.per_page)
    }
    if (this.$route.query.page) {
      this.page = parseInt(this.$route.query.page)
    }
    if (this.$route.query.openform) {
      this.showForm = true
    }
    this.fetchStates()
  },
  methods: {
    deviceFetched (val) {
      this.device = val
    },
    fetchStates () {
      this.$axios.get('/maintenance/state').then((response) => {
        this.statesItems = response.data
      })
    },
    printReport (event) {
    },
    showBarcode (id) {
      const uri = `/print/barcode/maintenance/${id}`
      window.open(uri, 'print barcode', 'width=400')
    },
    showA5 (id) {
      const uri = `/print/a5/maintenance/${id}`
      window.open(uri, 'print reciept', 'width=400')
    }
  }
}
</script>
