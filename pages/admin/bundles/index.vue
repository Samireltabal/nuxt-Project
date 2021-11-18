<template>
  <v-layout>
    <v-container fluid>
      <v-row>
        <v-col>
          <h3>إضافة باندل</h3>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-form>
            <v-autocomplete
              id="barcode"
              v-model="product_name"
              :items="items"
              :search-input.sync="search"
              dense
              hide-no-data
              item-text="product_name"
              autofocus
              clearable
              prepend-icon="mdi-basket-plus"
              label="إسم المنتج"
              hint="إبدأ بكتابة إسم المنتج"
              return-object
              filled
              outlined
              persistent-hint
              solo
              @change="itemSelected()"
            />
          </v-form>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="4">
          <v-sheet
            elevation="1"
            class="my-2"
          >
            <v-sheet
              class="pa-3 primary text-right"
              dark
            >
              <v-btn icon>
                <v-icon>mdi-content-save-cog-outline</v-icon>
              </v-btn>

              <v-btn
                class="ml-2"
                icon
              >
                <v-icon>mdi-check-bold</v-icon>
              </v-btn>
            </v-sheet>

            <div class="pa-4">
              <v-chip-group
                active-class="primary--text"
                column
              >
                <v-chip
                  v-for="product in selected"
                  :key="product.id"
                  close
                  close-icon="mdi-close-outline"
                  color="blue"
                  outlined
                  @click:close="removeItem(product.id)"
                >
                  {{ product.name }}
                </v-chip>
              </v-chip-group>
            </div>
          </v-sheet>
          <v-text-field
            v-model="price"
            class="my-2"
            label="سعر الباندل"
            hint="سعر الباندل"
            persistent-hint
            solo
            dense
            outlined
            filled
          />
          <v-text-field
            v-model="name"
            class="my-2"
            label="إسم الباندل"
            hint="إسم الباندل"
            persistent-hint
            solo
            dense
            outlined
            filled
          />
          <v-date-picker v-model="expires_at" />
          <v-btn block class="rounded-0 my-2" color="success" @click="submitBundle">
            <v-icon>mdi-plus</v-icon> إضافة
          </v-btn>
        </v-col>
        <v-col
          cols="12"
          sm="12"
          md="8"
          lg="8"
        >
          <v-simple-table>
            <thead>
              <tr>
                <td>id</td>
                <td>name</td>
                <td>price</td>
                <td>expire at</td>
                <td>options</td>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bundle in bundles" :key="bundle.id">
                <td>{{ bundle.id }}</td>
                <td>{{ bundle.name }}</td>
                <td>{{ bundle.price }}</td>
                <td>{{ bundle.expires_at }}</td>
                <td>
                  <v-btn icon small fab :color="bundle.active ? 'error' : 'success'" @click="bundle.active ? disable(bundle.id) : enable(bundle.id)">
                    <v-icon>
                      {{ bundle.active ? 'mdi-publish-off' : 'mdi-publish' }}
                    </v-icon>
                  </v-btn>
                  <v-btn
                    icon
                    small
                    fab
                    :disabled="!bundle.active"
                    color="indigo"
                    @click="viewBundle(bundle.id)"
                  >
                    <v-icon>
                      {{ bundle.active ? 'mdi-eye' : 'mdi-eye-off' }}
                    </v-icon>
                  </v-btn>
                  <v-btn icon small fab color="error" @click="deleteBundle(bundle.id)">
                    <v-icon>
                      mdi-delete
                    </v-icon>
                  </v-btn>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Bundles',
  layout: 'admin',
  data () {
    return {
      selected: [],
      quantity: null,
      price: null,
      expires_at: null,
      name: null,
      product_name: null,
      isLoading: false,
      search: null,
      barcode: null,
      entries: [],
      bundles: []
    }
  },
  async fetch () {
    this.bundles = await this.$axios.$get('/pos/bundles')
  },
  computed: {
    form_data () {
      return {
        name: this.name,
        products: this.selected,
        expires_at: this.expires_at,
        price: this.price
      }
    },
    fields () {
      if (!this.device) { return [] }
      return Object.keys(this.phone).map((key) => {
        return {
          key,
          value: this.phone(key) || 'n/a'
        }
      })
    },
    items () {
      return this.entries.map((entry) => {
        const Description = entry.product_name
        return Object.assign({}, entry, { Description })
      })
    }
  },
  watch: {
    search (val) {
      // Items have already been loaded
      // if (this.items.length > 0) { return }

      // Items have already been requested
      if (this.isLoading) { return }

      this.isLoading = true

      // Lazily load input items
      this.$axios.post('pos/products/search', { term: val })
        .then((res) => {
          this.entries = res.data
        })
        .finally(() => (this.isLoading = false))
    },
    product_name (val) {
      if (val && typeof val === 'object') {
        this.newitem = false
        this.price_disabled = false
        this.selling_price = val.original_price
        this.Pname = val.product_name
      } else {
        this.price_disabled = true
        this.selling_price = null
        this.Pname = null
      }
    }
  },
  methods: {
    itemSelected () {
      if (this.product_name === null) {
        return
      }
      const data = {
        id: this.product_name.id,
        name: this.product_name.product_name
      }
      if (!this.selected.includes(data)) {
        this.selected.push(data)
      }
    },
    checkIfExists (item) {
      if (this.selected.includes(item)) {
        return false
      } else {
        return true
      }
    },
    removeItem (id) {
      for (let i = 0; i < this.selected.length; i++) {
        if (this.selected[i].id === id) {
          this.selected.splice(i, 1)
          i--
        }
      }
    },
    disable (id) {
      this.$axios.get(`pos/bundles/disable/${id}`).then(() => {
        this.$fetch()
      })
    },
    enable (id) {
      this.$axios.get(`pos/bundles/enable/${id}`).then(() => {
        this.$fetch()
      })
    },
    deleteBundle (id) {
      this.$axios.get(`pos/bundles/delete/${id}`).then(() => {
        this.$fetch()
      })
    },
    viewBundle (id) {
      const uri = `/admin/bundles/show/${id}`
      this.$router.push(uri)
    },
    submitBundle () {
      this.$axios.post('/pos/bundles', this.form_data).then((response) => {
        console.log(response.data)
      })
    }
  }
}
</script>
