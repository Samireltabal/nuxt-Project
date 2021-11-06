<template>
  <v-layout app>
    <v-container>
      <v-row>
        <v-col>
          <device-type @device-fetched="deviceFetched" />
        </v-col>
      </v-row>
      <v-row>
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
            <v-chip :color="item.state.color" small>
              {{ item.state.state_name }}
            </v-chip>
          </template>
          <template #[`item.created_at`]="{ item }">
            {{ item.created_at }}
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
                @click="$router.push(`/maintainence/show/${item.id}`)"
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
      </v-row>
      <v-row>
        <v-col>
          <h3>Returned Data</h3>
          <p>
            {{ device }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import DeviceType from '../../components/Maintenance/DeviceType.vue'
export default {
  name: 'Maintenence',
  components: {
    DeviceType
  },
  data () {
    return {
      device: {},
      records: [],
      items: [],
      page: 1,
      dataLoading: true,
      searchTerm: null,
      per_page: 10,
      statesItems: [
        { text: 'تم الإستلام من العميل', value: 1 },
        { text: 'تم التسليم', value: 2 },
        { text: 'مرفوض', value: 3 }

      ],
      state_id: null,
      headers: [
        { text: '#', value: 'id' },
        { text: 'اسم العميل', value: 'customer.name' },
        { text: 'رقم العميل', value: 'customer.phone' },
        { text: 'نوع الجهاز', value: 'device.device_name' },
        { text: 'الحالة', value: 'state.state_name' },
        { text: 'العطل', value: 'problem' },
        { text: ' تاريخ انشاء السجل', value: 'created_at' },
        { text: 'خيارات', value: 'options' }
      ]
    }
  },
  async fetch () {
    const uri = `maintenance/records/list?per_page=${this.per_page}&verified=${this.verified_only}&page=${this.page}`
    this.records = await this.$axios.$get(uri)
    this.dataLoading = false
  },
  methods: {
    deviceFetched (val) {
      this.device = val
    }
  }
}
</script>
