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
        <v-dialog
          v-model="dialog"
          transition="dialog-bottom-transition"
          max-width="600"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              color="success"
              dark
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-store-plus</v-icon>  إضافة مخزن
            </v-btn>
          </template>
          <v-card>
            <v-toolbar
              color="indigo"
              dark
            >
              إضافة مخزن
            </v-toolbar>
            <v-card-text>
              <v-text-field v-model="inventory_name" label="إسم المخزن" />
              <v-checkbox v-model="inventory_saleable" label="بيع مباشر" />
            </v-card-text>
            <v-card-actions class="justify-end">
              <v-btn
                color="success"
                @click="submitInventory"
              >
                إضافة
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
      <v-col>
        <v-card flat>
          <v-card-title>
            قطع الغيار
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <v-simple-table
                  dense
                  fixed-header
                >
                  <template #default>
                    <thead>
                      <tr>
                        <th>
                          رقم
                        </th>
                        <th>
                          اسم المخزن
                        </th>
                        <th>
                          بيع مباشر
                        </th>
                        <th>
                          خيارات
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="inventory in inventories"
                        :key="inventory.id"
                      >
                        <td>{{ inventory.id }}</td>
                        <td>{{ inventory.inventory_name }}</td>
                        <td v-if="inventory.sellable">
                          <v-icon color="success">
                            mdi-check
                          </v-icon>
                        </td>
                        <td v-else>
                          <v-icon color="error">
                            mdi-file-excel-box-outline
                          </v-icon>
                        </td>
                        <td>
                          <v-chip
                            :disabled="default_stock == inventory.id"
                            small
                            class="my-1"
                            color="indigo"
                            dark
                            @click="submitItem(inventory.id)"
                          >
                            <v-icon>mdi-database-settings</v-icon>تعديل ك مخزن افتراضي
                          </v-chip>
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Inventories',
  layout: 'admin',
  data () {
    return {
      searchTerm: null,
      in_stock_only: false,
      per_page: 10,
      inventory_name: null,
      inventory_saleable: false,
      dialog: false,
      default_stock: null,
      inventories: {}
    }
  },
  watch: {

  },
  mounted () {
    this.fetchData()
    this.fetchDefaultStock()
  },
  methods: {
    fetchData () {
      const uri = 'admin/inventories/list'
      this.$axios.get(uri).then((response) => {
        this.inventories = response.data
      })
    },
    submitItem (item) {
      const data = {
        name: 'default_inventory',
        val: item,
        icon: 'mdi-store',
        label: 'المخزن الرئيسي'
      }
      this.$axios.post('/admin/settings', data).then(() => {
        this.$store.dispatch('notify', 'تم التعديل بنجاح')
        this.fetchData()
        this.fetchDefaultStock()
      })
    },
    submitInventory () {
      const data = {
        name: this.inventory_name,
        saleable: this.inventory_saleable
      }
      this.$axios.post('admin/inventories/create', data).then(() => {
        this.fetchData()
        this.fetchDefaultStock()
        this.inventory_name = null
        this.inventory_saleable = false
        this.dialog = false
      }).catch((err) => {
        this.$store.dispatch('notify', err.response.data)
      })
    },
    fetchDefaultStock () {
      this.$axios.get('admin/settings/default_inventory').then((response) => {
        this.default_stock = response.data
      })
    }
  }
}
</script>
