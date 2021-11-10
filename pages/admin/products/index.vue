<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn
          color="indigo"
          dark
          text
          @click="$router.push('/')"
        >
          <v-icon>mdi-arrow-right</v-icon>  العودة للرئيسية
        </v-btn>
      </v-col>
      <v-col>
        <v-card flat>
          <v-card-title>
            المنتجات
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12">
                <v-row>
                  <v-col cols="5">
                    <v-text-field
                      v-model="searchTerm"
                      clearable
                      append-icon="mdi-magnify"
                    />
                  </v-col>
                  <v-col cols="4">
                    <v-checkbox
                      v-model="in_stock_only"
                      label="البحث عن المنتجات المتوفرة فقط"
                    />
                  </v-col>
                  <v-col cols="3">
                    <add-product :categories="categories" @finished="$fetch()" />
                  </v-col>
                </v-row>
              </v-col>
              <v-col>
                <v-simple-table
                  dense
                  fixed-header
                >
                  <template #default>
                    <thead>
                      <tr>
                        <th>
                          اسم المنتج
                        </th>
                        <th>
                          وصف المنتج
                        </th>
                        <th>
                          المخزون
                        </th>
                        <th>
                          التصنيف
                        </th>
                        <th>
                          باركود
                        </th>
                        <th>
                          نقل المخزون
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="item in parts.data"
                        :key="item.id"
                      >
                        <td>{{ item.product_name }}</td>
                        <td>{{ item.description }}</td>
                        <td v-if="item.stock">
                          <span v-for="(quanity, stock) in item.stock" :key="stock" class="d-block">
                            {{ stock }} : {{ quanity }}
                          </span>
                        </td>
                        <td v-else>
                          غير متاح
                        </td>
                        <td>
                          {{ item.category.category_name }}
                        </td>
                        <td>
                          <v-img
                            :src="item.BarcodeUrl"
                            max-height="64"
                            contain
                          />
                        </td>
                        <td>
                          <moveStock :model-id="item.id" model-type="product" :inventories="inventories" @dataChanged="$fetch()" />
                          <AddToPurchaseOrder :part-id="item.id" model_type="product" :open-orders="open_orders" :is_part="false" />
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
              <v-col cols="12">
                <v-row>
                  <v-col cols="9">
                    <div class="text-center">
                      <v-pagination
                        v-model="current_page"
                        :length="parts.last_page"
                        circle
                      />
                    </div>
                  </v-col>
                  <v-col cols="3">
                    <v-select v-model="per_page" label="عدد النتائج في الصفحة" :items="[1,5,10,20,50,100]" />
                  </v-col>
                </v-row>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import moveStock from '../../../components/Admin/moveStock.vue'
import AddToPurchaseOrder from '../../../components/Admin/AddToPurchaseOrder.vue'
import addProduct from '../../../components/Products/addProduct.vue'
export default {
  name: 'Parts',
  components: {
    moveStock,
    AddToPurchaseOrder,
    addProduct
  },
  layout: 'admin',
  data () {
    return {
      searchTerm: null,
      in_stock_only: false,
      dialog: false,
      part_name: '',
      open_orders: [],
      categories: [],
      inventories: [],
      current_page: 1,
      part_description: '',
      per_page: 10,
      parts: {}
    }
  },
  async fetch () {
    let uri = '/pos/products?'
    uri += this.searchTerm ? 'search=' + this.searchTerm : ''
    uri += `&per_page=${this.per_page}`
    uri += `&page=${this.current_page}`
    uri += this.in_stock_only ? '&in_stock=' + this.in_stock_only : ''
    this.parts = await this.$axios.$get(uri)
  },
  watch: {
    searchTerm () {
      this.$fetch()
    },
    per_page () {
      this.$fetch()
    },
    in_stock_only () {
      this.$fetch()
    },
    current_page () {
      this.$fetch()
    }
  },
  mounted () {
    this.fetchInventories()
    this.get_open_orders()
    this.fetchCategories()
  },
  methods: {
    fetchInventories  () {
      this.$axios.get('admin/inventories/list').then((respone) => {
        this.inventories = respone.data
      })
    },
    fetchCategories  () {
      this.$axios.get('pos/categories').then((respone) => {
        this.categories = respone.data
      })
    },
    fetchParts () {
      // &per_page=${this.per_page}${this.in_stock_only ? '&in_stock='. this.in_stock_only : '' }`
      let uri = '/products/list?'
      uri += this.searchTerm ? 'search=' + this.searchTerm : ''
      uri += `&per_page=${this.per_page}`
      uri += `&page=${this.current_page}`
      uri += this.in_stock_only ? '&in_stock=' + this.in_stock_only : ''
      this.axios.get(uri).then((response) => {
        this.parts = response.data
        this.current_page = response.data.current_page
      })
    },
    addPart () {
      const data = {
        name: this.part_name,
        description: this.part_description
      }
      this.axios.post('products/parts/create', data).then(() => {
        this.fetchParts()
        this.dialog = false
        this.part_name = null
        this.part_description = null
      }).catch((err) => {
        this.$store.dispatch('notify', err.response.data.message)
      })
    },
    get_open_orders () {
      this.$axios.get('/orders/list?open_only=true').then((response) => {
        this.open_orders = response.data
      })
    }
  }
}
</script>
