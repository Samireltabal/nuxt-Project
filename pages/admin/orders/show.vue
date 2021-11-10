<template>
  <v-container>
    <v-row>
      <v-col>
        <h3>{{ msg }} رقم : {{ order_id }}</h3>
        <h4>إسم المورد : {{ order.supplier ? order.supplier.supplier_name : '' }}</h4>
        <h4>هاتف المورد : {{ order.supplier ? order.supplier.supplier_phone : '' }}</h4>
        <h4>عدد القطع المضافة : {{ order.items ? order.items.length : '' }}</h4>
        <h4>فتح الطلب بواسطة : {{ order.user ? order.user.name : '' }}</h4>
        <h4>رقم الوردية : {{ order.shift_id }}</h4>
      </v-col>
      <v-col>
        <h4>إضافة منتج للطلب</h4>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="model"
              label="إسم المنتج"
              :items="items"
              :loading="isLoading"
              :search-input.sync="search"
              hide-no-data
              hide-selected
              :item-text="is_part ? 'part_name' : 'product_name'"
              item-value="id"
              placeholder="Start typing to Search"
              prepend-icon="mdi-database-search"
              return-object
            />
          </v-col>
          <v-col>
            <v-checkbox v-model="is_part" label="قطع غيار" />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-text-field v-model="item_quantity" label="الكمية" />
          </v-col>
          <v-col>
            <v-btn block @click="submitItem">
              إضافة
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    {{ selectedId }}
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          dense
          hide-default-footer
          :items="order.items"
        >
          <template #[`item.accepted`]="{ item }">
            <v-chip x-small :color="item.accepted ? 'success' : 'warning'">
              <v-icon class="mx-2" :color="item.accepted ? 'white' : 'white'">
                {{ item.accepted ? 'mdi-check' : 'mdi-clock' }}
              </v-icon>{{ item.accepted ? 'تمت العملية' : 'معلق' }}
            </v-chip>
          </template>
          <template #[`item.options`]="{ item }">
            <span v-if="selectedId != item.id">
              <v-btn
                color="success"
                fab
                x-small
                class="mx-1 my-1"
                :disabled="item.purchase_price == 0"
                @click="acceptItem(item)"
              >
                <v-icon>mdi-checkbox-marked-outline</v-icon>
              </v-btn>
              <v-btn
                color="indigo"
                fab
                x-small
                class="mx-1 my-1"
                dark
                @click="selectItem(item.id)"
              >
                <v-icon>mdi-pencil-box-outline</v-icon>
              </v-btn>
              <v-btn
                color="error"
                fab
                x-small
                class="mx-1 my-1"
                dark
                @click="alert(item.id)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </span>
            <span v-else>
              <v-btn color="success" x-small class="mx-1 my-1" dark @click="updateItem(item)">
                <v-icon x-small>mdi-save</v-icon> حفظ
              </v-btn>
              <v-btn color="error" x-small class="mx-1 my-1" dark @click="cancelSelection">
                <v-icon x-small>mdi-cancel</v-icon> الغاء
              </v-btn>
            </span>
          </template>
          <template #[`item.purchase_price`]="{ item }">
            <span v-if="selectedId == item.id">
              <v-text-field v-model="item.purchase_price" label="سعر الشراء" />
            </span>
            <span v-else>
              {{ item.purchase_price }}
            </span>
          </template>
          <template #[`item.quantity`]="{ item }">
            <span v-if="selectedId == item.id">
              <v-text-field v-model="item.quantity" label="الكمية" />
            </span>
            <span v-else>
              {{ item.quantity }}
            </span>
          </template>
          <template #[`item.name`]="{ item }">
            <span v-if="item.purchasable_type == 'Syncit\\MaintenanceCenter\\Models\\Part'">
              {{ item.purchasable.part_name }}
            </span>
            <span v-if="item.purchasable_type == 'Synciteg\\PosSystem\\Models\\Product'">
              {{ item.purchasable.product_name }}
            </span>
          </template>
          <template #[`item.type`]="{ item }">
            <span v-if="item.purchasable_type == 'Syncit\\MaintenanceCenter\\Models\\Part'">
              قطع غيار
            </span>
            <span v-if="item.purchasable_type == 'Synciteg\\PosSystem\\Models\\Product'">
              منتجات
            </span>
          </template>
        </v-data-table>
        <hr>
        <v-simple-table dark class="py-2 px-2">
          <tr>
            <td colspan="2" class="text-center">
              الاجمالي
            </td>
            <td colspan="2" class="text-center">
              {{ order.sum }} جنيه
            </td>
            <td colspan="2" class="text-center">
              عدد القطع
            </td>
            <td colspan="1" class="text-center">
              {{ order.ItemCount }} قطعه
            </td>
          </tr>
          <tr>
            <td colspan="2" class="text-center">
              الاجمالي المدفوع
            </td>
            <td colspan="2" class="text-center">
              {{ order.total }} جنيه
            </td>
            <td colspan="2" class="text-center">
              عدد القطع المستلمة
            </td>
            <td colspan="1" class="text-center">
              {{ order.ItemsRecieved }} قطعه
            </td>
          </tr>
        </v-simple-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'PurchaseOrderShow',
  layout: 'admin',
  data () {
    return {
      msg: 'عرض امر شراء',
      order: {},
      descriptionLimit: 60,
      entries: [],
      selectedId: 0,
      isLoading: false,
      model: null,
      search: null,
      item_quantity: null,
      is_part: false,
      headers: [
        { text: 'إسم الصنف', value: 'name' },
        { text: 'النوع', value: 'type' },
        { text: 'الكمية', value: 'quantity' },
        { text: 'سعر الشراء', value: 'purchase_price' },
        { text: 'الاجمالي', value: 'total' },
        { text: 'الحالة', value: 'accepted' },
        { text: 'اعدادات', value: 'options' }
      ]
    }
  },
  async fetch () {
    this.order = await this.$axios.$get(`orders/show?order_id=${this.order_id}`)
  },
  computed: {
    order_id () {
      return this.$route.query.order
    },
    fields () {
      if (!this.model) { return [] }

      return Object.keys(this.model).map((key) => {
        return {
          key,
          value: this.model[key] || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        return Object.assign({}, entry)
      })
    }
  },
  watch: {
    order_id () {
      this.$fetch()
    },
    search (val) {
      this.search_term(val)
    }
  },
  mounted () {
  },
  methods: {
    fetch_order () {
      this.$fetch()
    },
    cancelSelection () {
      this.selectedId = null
      this.fetch_order()
    },
    selectItem (id) {
      this.selectedId = id
    },
    acceptItem (item) {
      const data = {
        item_id: item.id
      }
      this.$axios.post('/orders/item/accept', data).then((response) => {
        this.$store.dispatch('notify', response.data.message)
        this.fetch_order()
      }).catch((err) => {
        this.$store.dispatch('notify', err.response.data.message)
      })
    },
    updateItem (item) {
      this.$axios.post('orders/item/update', item).then((response) => {
        this.$store.dispatch('notify', `تم تعديل ${response.data.purchasable.part_name ? response.data.purchasable.part_name : response.data.purchasable.product_name} في الطلب`)
        this.selectedId = null
        this.fetch_order()
      }).catch(() => {
        this.$store.dispatch('notify', 'خطأ في التعديل')
      })
    },
    submitItem () {
      if (typeof this.model === 'object') {
        const data = {
          item_id: this.model.id,
          is_part: this.is_part,
          order_id: this.order_id,
          quantity: this.item_quantity
        }
        this.$axios.post('/orders/item/add', data).then((response) => {
          if (this.is_part) {
            this.$store.dispatch('notify', `تم إضافة ${response.data.part_name} للطلب`)
          } else {
            this.$store.dispatch('notify', `تم إضافة ${response.data.product_name} للطلب`)
          }
          this.fetch_order()
        })
      }
    },
    search_term (val) {
      const data = {
        item_name: val,
        is_part: this.is_part
      }
      this.$axios.post('/orders/item/search', data).then((response) => {
        this.entries = response.data
      }).finally(() => {
        this.isLoading = false
      })
    }
  }
}
</script>
