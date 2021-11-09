<template>
  <v-scroll-y-transition>
    <v-row class="py-5">
      <v-col cols="6">
        <customer-form @customer-fetched="customerFetched" />
        <v-text-field
          v-model="problem"
          dense
          outlined
          solo
          filled
          prepend-icon="mdi-information"
          label="عطل الجهاز"
        />
      </v-col>
      <v-col cols="6">
        <device-type @device-fetched="deviceFetched" />
        <v-select
          v-model="state"
          dense
          outlined
          :items="states"
          item-text="state_name"
          item-value="id"
          solo
          filled
          prepend-icon="mdi-information"
          label="حالة الجهاز"
        />
      </v-col>
      <v-col cols="12">
        <v-row>
          <v-col>
            <v-checkbox v-model="is_waiting" label="هل العميل منتظر في المحل" />
          </v-col>
          <v-col>
            <v-btn dark color="success" class="rounded-0" block @click="confirmAddition">
              إضافة السجل <v-icon>mdi-database-plus</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
      <pre>
        {{ record }}
      </pre>
    </v-row>
  </v-scroll-y-transition>
</template>
<script>
import DeviceType from '../../components/Maintenance/DeviceType.vue'
import CustomerForm from '../../components/Maintenance/CustomerForm.vue'
export default {
  name: 'AddrecordForm',
  components: {
    DeviceType,
    CustomerForm
  },
  props: {
    states: {
      required: true,
      type: [Array, Object]
    }
  },
  data () {
    return {
      device: {},
      customer: {},
      is_waiting: false,
      problem: null,
      state: 0
    }
  },
  computed: {
    record () {
      return {
        device_type_id: this.device ? this.device.id : null,
        customer_id: this.customer ? this.customer.id : null,
        problem: this.problem,
        current_state_id: this.state,
        is_waiting: this.is_waiting
      }
    }
  },
  methods: {
    deviceFetched (val) {
      this.device = val
    },
    customerFetched (val) {
      this.customer = val
    },
    confirmAddition () {
      this.$swal.fire({
        title: 'مراجعة بيانات السجل',
        html:
        `إسم العميل : ${this.customer.name}<br />` +
        `نوع الجهاز : ${this.device.device_name} <br />` +
        `عطل الجهاز : ${this.problem} <br />` +
        `العميل منتظر: ${this.is_waiting} <br />`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'إضافة السجل',
        cancelButtonText: 'تعديل البيانات'
      }).then((result) => {
        if (result.isConfirmed) {
          this.submitRecord()
        }
      })
    },
    submitRecord () {
      this.$axios.post('/maintenance/records/create', this.record).then((respone) => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          showConfirmButton: false,
          timer: 1500
        })
        this.$router.push(`/maintenance/show/${respone.data.id}`)
      })
    }
  }
}
</script>
