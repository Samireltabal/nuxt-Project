<template>
  <v-layout>
    <v-container>
      <v-card>
        <v-card-title>
          عرض بيانات جهاز || {{ record.device.device_name }} - {{ record.customer.name }}
          <p>
            {{ label_uri }}
          </p>
        </v-card-title>
        <v-card-actions>
          <v-btn
            color="indigo"
            dark
            text
            @click="$router.push('/')"
          >
            <v-icon>mdi-arrow-right</v-icon>  العودة للرئيسية
          </v-btn>
          <v-btn
            color="success"
            class="mx-2"
            dark
            @click="$router.push('/maintenance?openform=true')"
          >
            <v-icon>mdi-folder-plus</v-icon>  سجل جديد
          </v-btn>
          <v-btn
            color="indigo"
            dark
            @click="$router.push('/maintenance')"
          >
            <v-icon color="text-right mr-2">
              mdi-folder-multiple
            </v-icon> قائمة السجلات
          </v-btn>
          <v-btn
            outlined
            class="ma-1"
            small
            color="primary"
            @click="showBarcode(record.id)"
          >
            <v-icon>mdi-barcode</v-icon> طباعة الباركود
          </v-btn>
          <v-btn
            outlined
            class="ma-1"
            small
            color="indigo"
            @click="showA5(record.id)"
          >
            <v-icon>mdi-printer</v-icon> طباعة الايصال
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <v-row>
            <v-col cols="3">
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>إسم العميل</v-list-item-subtitle>
                  <v-list-item-title>{{ record.customer.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>نوع الجهاز</v-list-item-subtitle>
                  <v-list-item-title>{{ record.device.device_name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>تاريخ الدخول</v-list-item-subtitle>
                  <v-list-item-title>{{ $luxon(record.created_at) }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>العطل</v-list-item-subtitle>
                  <v-list-item-title>{{ record.problem }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>الوضع الحالي</v-list-item-subtitle>
                  <v-list-item-title>{{ record.state.state_name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item two-line>
                <v-list-item-content>
                  <v-list-item-subtitle>ملاحظات</v-list-item-subtitle>
                  <v-list-item-title>{{ record.notes }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-col>
            <v-col cols="6">
              <v-timeline
                dense
                clipped
              >
                <v-timeline-item
                  class="mb-6"
                  hide-dot
                >
                  <h5>بيانات السجل</h5>
                </v-timeline-item>

                <v-timeline-item
                  v-for="item in record.events"
                  :key="item.id"
                  class="mb-4"
                  color="green"
                  :icon-color="item.event_type.color"
                  small
                >
                  <v-row justify="space-between" style="border-bottom: 1px solid #ddd;">
                    <v-col cols="7">
                      تحولت الحالة الى
                      <v-chip
                        class="white--text ml-0"
                        :color="item.event_type.color"
                        label
                        small
                      >
                        {{ item.event_type.event_name }}
                      </v-chip>
                      <p>
                        {{ item.note }}
                      </p>
                      <p>
                        <v-chip
                          v-for="(part, id) in item.AttachedParts"
                          :key="id"
                          small
                          class="mx-1"
                          color="indigo"
                          dark
                        >
                          {{ part }}
                        </v-chip>
                      </p>
                    </v-col>
                    <v-col
                      class="text-right"
                      cols="5"
                    >
                      <addPart :event-id="item.id" :record-id="record.id" @dataChanged="$fetch()" />
                      <addEvent :event-id="item.id" @dataChanged="$fetch()" /> {{ $luxon(item.created_at) }}
                    </v-col>
                  </v-row>
                </v-timeline-item>
              </v-timeline>
            </v-col>
            <v-col cols="3">
              <StateBox @dataFetched="stateChange" />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </v-layout>
</template>
<script>
import StateBox from '../../../components/Maintenance/StateBox.vue'
import addEvent from '../../../components/Maintenance/addEvent.vue'
import addPart from '../../../components/Maintenance/addPart.vue'
export default {
  name: 'ShowRecord',
  components: {
    StateBox,
    addEvent,
    addPart
  },
  data () {
    return {
      record: {
        device: {},
        customer: {},
        state: {}
      }
    }
  },
  async fetch () {
    this.record = await this.$axios.$get(`/maintenance/records/show/${this.record_id}`)
  },
  computed: {
    record_id () {
      return this.$route.params.id
    },
    label_uri () {
      return process.env.VUE_APP_MAINTAINENCE_LABEL_URI
    }
  },
  methods: {
    stateChange (state) {
      this.$axios.post(`/maintenance/state/${this.record.id}/${state.id}`).then(() => {
        this.$toast.success('تم التعديل')
        this.$fetch()
      }).catch((err) => {
        this.$toast.error(err.response.data.message)
        this.$fetch()
      })
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
