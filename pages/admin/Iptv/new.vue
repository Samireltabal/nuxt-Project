<template>
  <v-container fluid>
    <v-row>
      <v-col>
        <v-text-field
          v-model="server_name"
          label="إسم السيرفر"
          hint="إسم السيرفر المراد إضافته"
          persistent-hint
          solo
          outlined
          filled
          flat
        />
      </v-col>
      <v-col>
        <v-select
          v-model="supplier_id"
          label="إسم المورد"
          :items="suppliers"
          item-text="supplier_name"
          item-value="id"
          hint="المورد الخاص بالسيرفر"
          persistent-hint
          solo
          outlined
          filled
          flat
        />
      </v-col>
      <v-col>
        <v-text-field
          v-model="price"
          label="سعر شراء السيرفر"
          hint="سعر شراء السيرفر المراد إضافته"
          persistent-hint
          solo
          outlined
          filled
          flat
        />
      </v-col>
    </v-row>
    <v-row>
      <v-btn
        block
        color="success"
        dark
        large
        class="rounded-0"
        @click="submitServer"
      >
        إضافة <v-icon>mdi-plus</v-icon>
      </v-btn>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'NewServer',
  layout: 'admin',
  data () {
    return {
      server_name: null,
      supplier_id: null,
      suppliers: []
    }
  },
  async fetch () {
    this.suppliers = await this.$axios.$get('admin/suppliers/list')
  },
  computed: {
    form () {
      return {
        server_name: this.server_name,
        supplier_id: this.supplier_id,
        purchase_price: this.price
      }
    }
  },
  methods: {
    submitServer () {
      this.$swal.fire({
        title: 'هل انت متأكد ؟ ',
        html: 'برجاء مراجعة البيانات الخاصة بالسيرفر' + '<br />' +
        `
          <b>إسم السيرفر</b> : ${this.server_name} <br>
          <b>السعر</b> : ${this.price} <br>
        `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'إضافة',
        cancelButtonText: 'الغاء'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.post('/pos/iptv/server/create', this.form).then((response) => {
            this.$swal.fire(
              'تمت الإضافة بنجاح',
              'تمت إضافة السيرفر بنجاح سيتم تحويلك لصفحة السيرفر الأن',
              'success'
            )
            setTimeout(() => {
              this.$router.push(`/admin/iptv/${response.data.id}`)
            }, 1500)
          }).catch((err) => {
            this.$swal.fire(
              'خطأ في الإضافة',
              err.response.data.message,
              'error'
            )
          })
        }
      })
    }
  }
}
</script>
