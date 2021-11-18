<template>
  <v-layout>
    <v-container fluid>
      <v-row>
        <v-col>
          <h3>
            إدارة المبيعات
            <v-switch
              v-model="is_admin"
              label="Admin View"
              color="red"
              hide-details
            />
          </h3>
        </v-col>
        <v-col>
          الوقت الان : {{ $luxon(shift.now) }}
        </v-col>
        <v-col>
          الحالة : {{ shift_validity ? "جاهز" : "لم يتم تحديث الوردية برجاء مراجعة مدير النظام" }}
        </v-col>
      </v-row>
      <hr>
      <v-row>
        <v-col cols="3">
          <v-row>
            <hr>
            <v-col cols="12">
              <v-row>
                <v-col v-if="current_invoice && current_invoice.shift_id" cols="12">
                  <v-list>
                    <v-list-item>إسم العميل : {{ current_invoice.customer.name }}</v-list-item>
                    <v-list-item>تاريخ الفتح : {{ $luxon(current_invoice.created_at) }}</v-list-item>
                    <v-list-item>
                      <v-btn block color="success" dark>
                        <v-icon class="mx-1">
                          mdi-lock
                        </v-icon> غلق الفاتورة
                      </v-btn>
                    </v-list-item>
                    <v-list-item>
                      <v-btn block color="indigo" dark>
                        <v-icon class="mx-2">
                          mdi-printer
                        </v-icon>  طباعة الفاتورة
                      </v-btn>
                    </v-list-item>
                  </v-list>
                </v-col>
                <v-col v-else cols="12">
                  <h4>الوردية الرئيسية</h4>
                </v-col>
                <v-col cols="12">
                  <v-select v-model="selected_invoice" :items="active_invoices_arr" clearable :value="selected_invoice">
                    <template #append-item>
                      <v-list-item @click="selected_invoice = null">
                        <v-list-item-content>
                          <v-list-item-title>
                            بيع عام بدون فاتورة
                          </v-list-item-title>
                        </v-list-item-content>
                      </v-list-item>
                      <v-divider class="mt-2" />
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="12">
                  <CustomerForm @customer-fetched="customerFetched" />
                  <v-btn
                    block
                    color="primary"
                    :dark="customer_id"
                    class="my-1"
                    :disabled="!customer_id"
                    @click="create_invoice"
                  >
                    فاتورة جديدة <v-icon class="mx-1">
                      mdi-plus
                    </v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="9">
          <v-card color="basil">
            <v-tabs
              v-model="tab"
              background-color="transparent"
              color="basil"
              grow
              centered
              icons-and-text
            >
              <v-tabs-slider color="indigo" />
              <v-tab href="#tab-1">
                باركود
                <v-icon class="mx-2">
                  mdi-barcode
                </v-icon>
              </v-tab>
              <v-tab href="#tab-2">
                المبيعات
                <v-icon class="mx-2">
                  mdi-basket
                </v-icon>
              </v-tab>

              <v-tab href="#tab-3">
                الصيانة
                <v-icon class="mx-2">
                  mdi-wrench
                </v-icon>
              </v-tab>

              <v-tab href="#tab-4">
                IPTV
                <v-icon class="mx-2">
                  mdi-television-play
                </v-icon>
              </v-tab>
            </v-tabs>
            <v-tabs-items v-model="tab">
              <v-tab-item value="tab-1">
                <v-row>
                  <v-col cols="12">
                    <barcode-sell :invoice-id="selected_invoice" :shift-id="shift.id" @itemSubmited="get_invoice" />
                  </v-col>
                </v-row>
              </v-tab-item>
              <v-tab-item value="tab-2">
                <product-sell :invoice-id="selected_invoice" :shift-id="shift.id" @itemSubmited="get_invoice" />
              </v-tab-item>
              <v-tab-item value="tab-3">
                <maintainence-sell />
              </v-tab-item>
              <v-tab-item value="tab-4">
                <IPTV-sell />
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-col>
      </v-row>
      <v-row>
        <v-col v-if="is_admin || current_invoice && current_invoice.is_invoice" cols="12">
          <v-simple-table>
            <template #default>
              <thead>
                <tr>
                  <th class="text-center">
                    رقم الحركة
                  </th>
                  <th class="text-center">
                    نوع الحركة
                  </th>
                  <th class="text-center">
                    إسم الصنف
                  </th>
                  <th class="text-center">
                    السعر
                  </th>
                  <th class="text-center">
                    الخصم
                  </th>
                  <th class="text-center">
                    الكمية
                  </th>
                  <th class="text-center">
                    الاجمالي
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in current_invoice.items" :key="item.id">
                  <td class="text-center">
                    {{ item.id }}
                  </td>
                  <td class="text-center">
                    <span v-if="item.invoicable_type === &quot;Synciteg\\PosSystem\\Models\\Product&quot;">
                      مبيعات
                    </span>
                    <span v-if="item.invoicable_type === &quot;Synciteg\\PosSystem\\Models\\IptvSubscription&quot;">
                      IPTV
                    </span>
                    <span v-if="item.invoicable_type === &quot;Syncit\\MaintenanceCenter\\Models\\Record&quot;">
                      صيانة
                    </span>
                  </td>
                  <td class="text-center">
                    <span v-if="item.invoicable_type === &quot;Synciteg\\PosSystem\\Models\\Product&quot;">
                      {{ item.invoicable.product_name }}
                    </span>
                    <span v-if="item.invoicable_type === &quot;Synciteg\\PosSystem\\Models\\IptvSubscription&quot;">
                      {{ item.invoicable.ServerName }}
                    </span>
                    <span v-if="item.invoicable_type === &quot;Syncit\\MaintenanceCenter\\Models\\Record&quot;">
                      {{ item.invoicable.device.device_name }}
                    </span>
                  </td>
                  <td class="text-center">
                    <span :class="item.discount > 0 ? 'text-decoration-line-through' : ''">{{ item.invoicable_type === "Synciteg\\PosSystem\\Models\\Product" ? item.invoicable.original_price : item.selling_price }}</span> <span :class="item.discount > 0 ? '' : 'd-none' ">|| {{ item.selling_price }}</span>
                  </td>
                  <td class="text-center">
                    {{ item.fixed_discount ? item.discount + ' جنيه' : item.discount + ' %' }}
                  </td>
                  <td class="text-center">
                    {{ item.quantity }}
                  </td>
                  <td class="text-center">
                    {{ item.total }}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="2">
                    الإجمالي قبل الخصم
                  </td>
                  <td colspan="2">
                    {{ current_invoice.meta ? current_invoice.meta.totalBeforeDiscount : '' }} جنيه
                  </td>
                  <td colspan="2">
                    قيمة الخصم
                  </td>
                  <td>{{ current_invoice.meta ? current_invoice.meta.discount : '' }} جنيه</td>
                </tr>
                <tr>
                  <td colspan="2">
                    الإجمالي
                  </td>
                  <td colspan="2">
                    {{ current_invoice.meta ? current_invoice.meta.total : '' }} جنيه
                  </td>
                  <td colspan="2">
                    عدد القطع
                  </td>
                  <td>{{ current_invoice.meta ? current_invoice.meta.count : '' }} قطعه</td>
                </tr>
              </tfoot>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
import BarcodeSell from '../../components/Sales/BarcodeSell.vue'
import ProductSell from '../../components/Sales/ProductSell.vue'
import IPTVSell from '../../components/Sales/IPTVSell.vue'
import MaintainenceSell from '../../components/Sales/MaintainenceSell.vue'
import CustomerForm from '../../components/Maintenance/CustomerForm.vue'
export default {
  components: {
    BarcodeSell,
    ProductSell,
    MaintainenceSell,
    IPTVSell,
    CustomerForm
  },
  data () {
    return {
      tab: 0,
      is_admin: false,
      current_invoice: [],
      customer_id: null,
      active_invoices: []
    }
  },
  async fetch () {
    const data = {
      invoice_id: this.selected_invoice
    }
    this.current_invoice = await this.$axios.$post('/pos/sales/invoices/show', data)
  },
  computed: {
    shift () {
      return this.$store.state.shift_data
    },
    shift_validity () {
      return this.$store.state.shift_validity
    },
    // is_admin () {
    //   return this.$store.state.auth.user.role === 'admin'
    // },
    active_invoices_arr () {
      const data = []
      this.active_invoices.forEach((element) => {
        data.push({ text: `${element.customer.name} - ${element.id}`, value: element.id })
      })
      return data
    },
    selected_invoice: {
      get () {
        return parseInt(this.$route.query.invoice)
      },
      set (val) {
        if (val === 'NaN' || val === null) {
          this.$router.push({ path: this.$route.path, query: { invoice: null } })
          this.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'تم التحويل للمبيعات العامة ',
            showConfirmButton: false,
            timer: 1500
          })
        } else {
          this.$router.push({ path: this.$route.path, query: { invoice: val } })
          this.$swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'تم التحويل لفاتورة رقم : ' + val,
            showConfirmButton: false,
            timer: 1500
          })
        }
      }
    }
  },
  watch: {
    selected_invoice (val) {
      // this.$router.replace({ path: this.$route.path, query: { invoice: val } })
      this.$fetch()
    }
  },
  mounted () {
    if (this.$route.query.tab) {
      this.tab = this.$route.query.tab
    }
    this.list_open_invoices()
    // this.get_invoice()
  },
  methods: {
    customerFetched (val) {
      this.customer_id = val
    },
    list_open_invoices () {
      this.$axios.get('/pos/sales/invoices').then((response) => {
        this.active_invoices = response.data
      })
    },
    get_invoice () {
      this.$fetch()
    },
    create_invoice () {
      if (this.customer_id.id != null) {
        this.$axios.post('/pos/sales/invoices', { customer_id: this.customer_id.id }).then((response) => {
          this.$router.replace({ path: this.$route.path, query: { invoice: response.data.id } })
          this.list_open_invoices()
          this.selected_invoice = response.data.id
        })
      }
    }
  }
}
</script>
