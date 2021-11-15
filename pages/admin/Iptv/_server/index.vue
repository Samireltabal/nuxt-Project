<template>
  <v-layout app>
    <v-container fluid>
      <v-row>
        <v-col>
          <h3>{{ server.server_name }}</h3>
          <v-btn class="rounded-0" block :color="showForm ? 'error' : 'success'" large @click="showForm = ! showForm">
            <v-icon>{{ !showForm ? 'mdi-plus' : 'mdi-minus' }}</v-icon> {{ !showForm ? 'إضافة اكواد' : 'إلغاء' }}
          </v-btn>
        </v-col>
        <v-col v-if="showForm">
          <v-expand-transition>
            <v-form>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="period"
                    label="مدة الأكواد المضافة"
                    hint="مدة الأكواد المضافة بالشهور"
                    persistent-hint
                    type="number"
                    solo
                    outlined
                    filled
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="codes"
                    label="الأكود"
                    hint="اضف الأكواد مفصولة ب ',' "
                    persistent-hint
                    type="number"
                    solo
                    outlined
                    filled
                  />
                </v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-btn color="success" block class="rounded-0" @click="submitCodes">
                    إضافة <v-icon>mdi-plus</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-expand-transition>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8">
          <h3>الأكواد المستخدمة</h3>
          <v-data-table
            :headers="headers"
            :items="server.used_codes"
            :items-per-page="10"
            class="elevation-1"
          />
        </v-col>
        <v-col cols="4">
          <h3>الأكواد الجديدة</h3>
          <v-data-table
            :headers="new_headers"
            :items="server.available_codes"
            :items-per-page="10"
            class="elevation-1"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Server',
  layout: 'admin',
  data () {
    return {
      showForm: false,
      period: 12,
      server: {},
      headers: [
        { text: '#', value: 'id' },
        { text: 'code', value: 'code' },
        { text: 'start date', value: 'start_date' },
        { text: 'إسم العميل', value: 'customer.name' },
        { text: 'تليفون', value: 'customer.phone' },
        { text: 'المدة', value: 'periodByMonth' }

      ],
      new_headers: [
        { text: 'id', value: 'id' },
        { text: 'code', value: 'code' },
        { text: 'المدة', value: 'periodByMonth' }
      ]
    }
  },
  async fetch () {
    this.server = await this.$axios.$get(`/pos/iptv/server?server_id=${this.server_id}`)
  },
  computed: {
    server_id () {
      return this.$route.params.server
    },
    form () {
      return {
        server_id: this.server_id,
        periodByMonth: this.period,
        codes: this.codes
      }
    }
  },
  methods: {
    submitCodes () {
      this.$axios.post('/pos/iptv/codes/add', this.form).then((response) => {
        this.$swal.fire(
          'تمت الإضافة بنجاح',
          response.data,
          'success'
        )
        this.showForm = false
        this.codes = null
        this.period = 12
        this.$fetch()
      })
    }
  }
}
</script>
