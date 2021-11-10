<template>
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
        إضافة منتج جديد
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="indigo"
        dark
      >
        إضافة منتج جديد
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-text-field v-model="name" label="اسم المنتج" />
          </v-col>
          <v-col cols="12">
            <v-text-field v-model="price" label="سعر البيع" />
          </v-col>
          <v-col cols="12">
            <v-checkbox v-model="new_category" label="تصنيف جديد" />
          </v-col>
          <v-col v-if="!new_category" cols="12">
            <v-select
              v-model="category_id"
              label="التصنيف"
              :items="categories"
              item-text="category_name"
              item-value="id"
              clearable
            />
          </v-col>
          <v-col v-else cols="12">
            <v-text-field v-model="new_category_name" label="إسم التصنيف الجديد" />
          </v-col>
          <v-col cols="12">
            <v-select
              v-model="category_id"
              label="نوع المنتج"
              :items="['منتج','خدمة']"
              clearable
            />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <pre>
          {{ formData }}
        </pre>
        <v-btn
          color="success"
          @click="addProduct"
        >
          إضافة منتج
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'AddProduct',
  props: {
    categories: {
      type: [Array, Object],
      required: true
    }
  },
  data () {
    return {
      dialog: false,
      name: '',
      price: '',
      category: '',
      product_type: 'منتج',
      category_id: null,
      new_category: false,
      new_category_name: ''
    }
  },
  computed: {
    formData () {
      return {
        product_name: this.name,
        newCategory: this.new_category,
        product_type: 'منتج',
        original_price: this.price,
        category_id: this.new_category ? null : this.category_id,
        category: this.new_category ? this.new_category_name : null
      }
    }
  },
  methods: {
    addProduct () {
      this.$axios.post('pos/products', this.formData).then((response) => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'success',
          title: 'تمت الإضافة بنجاح',
          text: response.data.product_name,
          showConfirmButton: false,
          timer: 1500
        })
        this.name = ''
        this.price = ''
        this.category = ''
        this.product_type = 'منتج'
        this.category_id = null
        this.new_category = false
        this.dialog = false
        this.$emit('finished')
      }).catch((err) => {
        this.$swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'خطأ في الإضافه',
          text: err.response.data.message,
          showConfirmButton: false,
          timer: 1500
        })
      })
    },
    categoryChanged (event) {
      console.log(event)
    },
    prepareForNewCategory () {
      this.new_category = true
      this.categoryChanged()
    }
  }
}
</script>
