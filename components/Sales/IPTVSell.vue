<template>
  <v-layout>
    <v-row>
      <v-col>
        <v-stepper v-model="e1">
          <v-stepper-header>
            <v-stepper-step
              :complete="e1 > 1"
              step="1"
            >
              إختيار نوع السيرفر
            </v-stepper-step>

            <v-divider />

            <v-stepper-step
              :complete="e1 > 2"
              step="2"
            >
              الدفع
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="3">
              الكود
            </v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card
                class="mb-12"
                height="200px"
              >
                <v-select
                  v-model="selected_server"
                  clearable
                  solo
                  outlined
                  flat
                  large
                  :items="servers"
                  item-text="server_name"
                  item-value="id"
                  label="نوع السيرفر"
                >
                  <template slot="item" slot-scope="data">
                    <!-- HTML that describe how select should render items when the select is open -->
                    {{ data.item.server_name }}
                  </template>
                </v-select>
                <v-alert v-if="!getCountOfServer(selected_server)" color="error" dark>
                  لم تقم بأختيار السيرفر او لا يوجد اكواد متوفرة
                </v-alert>
              </v-card>

              <v-btn
                color="#16a085"
                dark
                :disabled="!getCountOfServer(selected_server)"
                @click="e1 = 2"
              >
                إستمرار
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                class="mb-12"
              >
                <v-text-field
                  v-model="price_set"
                  flat
                  solo
                  outlined
                  type="number"
                  large
                  filled
                  label="سعر البيع"
                />
                <device-type @device-fetched="deviceFetched" />
                <CustomerForm @customer-fetched="customerFetched" />
              </v-card>
              <v-btn
                color="#16a085"
                dark
                :disabled="!selected_server || !price_set || !device_type"
                @click="submitIptvRequest()"
              >
                إستمرار
              </v-btn>

              <v-btn text @click="finishIptvProcess">
                الغاء
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                class="mb-12"
              >
                <h4 class="text-center my-2">
                  تم التفعيل بنجاح
                </h4>
                <v-btn
                  class="text-center"
                  color="#16a085"
                  dark
                  block
                  :loading="fetchingCode"
                  large
                  @click="getCode(request_data.id)"
                >
                  إضغط هنا لإظهار الكود
                </v-btn>
                <span v-if="codeFetched">
                  <v-list>
                    <v-list-item>
                      إسم العميل : {{ code_data.customer.name }}
                    </v-list-item>
                    <v-list-item>
                      نوع السيرفر : {{ code_data.ServerName }}
                    </v-list-item>
                    <v-list-item color="#16a085">
                      <v-chip color="#16a085" dark x-large>
                        كود التفعيل : {{ code_data.code.code }}
                      </v-chip>
                      <small class="mx-2">
                        يجب كتابة الكود الأن : لن يظهر مرة اخرى
                      </small>
                    </v-list-item>
                    <v-list-item>
                      صالح حتى : {{ code_data.end_date }}
                    </v-list-item>
                    <v-list-item>
                      السعر : {{ code_data.price }}
                    </v-list-item>
                  </v-list>
                </span>
              </v-card>
              <v-btn
                color="#16a085"
                large
                :dark="codeFetched"
                :disabled="!codeFetched"
                @click="finishIptvProcess"
              >
                إنهاء
              </v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
  </v-layout>
</template>
<script>
import DeviceType from '../../components/Maintenance/DeviceType.vue'
import CustomerForm from '../../components/Maintenance/CustomerForm.vue'
export default {
  components: {
    DeviceType,
    CustomerForm
  },
  data () {
    return {
      e1: 1,
      selected_server: null,
      price_set: null,
      request_data: {},
      fetchingCode: false,
      codeFetched: false,
      code_data: {},
      customer_id: null,
      device_type: null,
      servers: []
    }
  },
  computed: {
    form () {
      return {
        customer_id: this.customer_id,
        device_type_id: this.device_type,
        server_type: this.selected_server,
        price: this.price_set
      }
    }
  },
  mounted () {
    this.fetchServers()
  },
  methods: {
    fetchServers () {
      this.$axios.get('pos/iptv/server/list').then((response) => {
        this.servers = response.data
      })
    },
    getCode (id) {
      this.fetchingCode = true
      this.$axios.post('pos/iptv/show', { code_id: id }).then((response) => {
        this.codeFetched = true
        this.code_data = response.data
      }).finally(() => {
        this.fetchingCode = false
      })
    },
    customerFetched (val) {
      this.customer_id = val.id
    },
    deviceFetched (val) {
      this.device_type = val.id
    },
    submitIptvRequest () {
      this.$axios.post('/pos/iptv/request', this.form).then((response) => {
        this.e1 = 3
        this.request_data = response.data
      })
    },
    getCountOfServer (id) {
      const found = this.servers.find(e => e.id === id)
      if (found) {
        return found.CodesCount
      } else {
        return null
      }
    },
    finishIptvProcess () {
      this.fetchServers()
      this.e1 = 1
      this.device_type = null
      this.request_data = {}
      this.codeFetched = false
      this.code_data = {}
      this.selected_server = null
      this.price_set = null
      this.customer_id = null
    }
  }
}
</script>
