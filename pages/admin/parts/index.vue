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
            قطع الغيار
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
                      label="البحث عن القطع المتوفرة فقط"
                    />
                  </v-col>
                  <v-col cols="3">
                    <v-dialog
                      v-model="dialog"
                      transition="dialog-bottom-transition"
                      max-width="600"
                    >
                      <template #activator="{ on, attrs }">
                        <v-btn
                          color="primary"
                          x-small
                          v-bind="attrs"
                          v-on="on"
                        >
                          إضافة قطعة جديدة
                        </v-btn>
                      </template>
                      <v-card>
                        <v-toolbar
                          color="indigo"
                          dark
                        >
                          إضافة قطعة جديدة
                        </v-toolbar>
                        <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <v-text-field v-model="part_name" label="اسم القطعة" />
                            </v-col>
                            <v-col cols="12">
                              <v-text-field v-model="part_description" label="وصف القطعة" />
                            </v-col>
                          </v-row>
                        </v-card-text>
                        <v-card-actions class="justify-end">
                          <v-btn
                            color="success"
                            @click="addPart"
                          >
                            إضافة قطعة
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
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
                          اسم القطعة
                        </th>
                        <th>
                          وصف القطعة
                        </th>
                        <th>
                          المخزون
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
                        <td>{{ item.part_name }}</td>
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
                          <moveStock :model-id="item.id" model-type="part" :inventories="inventories" :is-part="true" @dataChanged="$fetch()" />
                          <AddToPurchaseOrder :part-id="item.id" model_type="part" :open-orders="open_orders" :is-part="true" />
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
export default {
  name: 'Parts',
  components: {
    moveStock,
    AddToPurchaseOrder
  },
  layout: 'admin',
  data () {
    return {
      searchTerm: null,
      in_stock_only: false,
      dialog: false,
      part_name: '',
      open_orders: [],
      inventories: [],
      current_page: 1,
      part_description: '',
      per_page: 10,
      parts: {}
    }
  },
  async fetch () {
    let uri = '/parts?'
    uri += this.searchTerm ? 'search=' + this.searchTerm : ''
    uri += `&per_page=${this.per_page}`
    uri += `&page=${this.current_page}`
    uri += this.in_stock_only ? '&in_stock=' + this.in_stock_only : ''
    const response = await this.$axios.$get(uri)
    this.parts = response
    this.current_page = response.current_page
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
  },
  methods: {
    fetchInventories  () {
      this.$axios.get('admin/inventories/list').then((response) => {
        this.inventories = response.data
      })
    },
    fetchParts () {
      // &per_page=${this.per_page}${this.in_stock_only ? '&in_stock='. this.in_stock_only : '' }`
    },
    addPart () {
      const data = {
        name: this.part_name,
        description: this.part_description
      }
      this.$axios.post('/parts', data).then(() => {
        this.$fetch()
        this.dialog = false
        this.part_name = null
        this.part_description = null
      }).catch((err) => {
        this.$toast.success(err.response.data.message)
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
