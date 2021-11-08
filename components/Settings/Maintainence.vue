<template>
  <v-card>
    <v-container>
      <v-card-title>
        إعدادات الصيانة
      </v-card-title>
      <v-card-text>
        <!-- States -->
        <v-row>
          <v-col cols="12" md="6">
            <h5>حالات الاجهزة</h5>
          </v-col>
          <v-col cols="12" md="6">
            <h5>حالات الاجهزة</h5>
          </v-col>
          <v-col>
            <v-list dense>
              <v-list-item-group>
                <v-list-item v-for="state in states" :key="state.id">
                  <v-list-item-content>
                    <v-list-item-title v-text="state.state_name" />
                    <v-list-item-subtitle>
                      <v-text-field v-model="state.color" label="لون الحالة" />
                      <v-btn @click="changeStateColor(state.id, state.color)">
                        تعديل
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <v-btn icon @click="deleteState(state)">
                      <v-icon color="grey lighten-1">
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-text-field
              v-model="state_name"
              label="إسم الحالة"
            />
            <v-btn @click="createState">
              إضافة
            </v-btn>
          </v-col>
          <!-- events -->
          <v-col>
            <v-list dense>
              <v-list-item-group>
                <v-list-item v-for="event in eventTypes" :key="event.id">
                  <v-list-item-content>
                    <v-list-item-title v-text="event.event_name" />
                    <v-list-item-subtitle>
                      <v-text-field v-model="event.color" label="لون الحدث" />
                      <v-btn @click="changeColor(event.id, event.color)">
                        تعديل
                      </v-btn>
                    </v-list-item-subtitle>
                  </v-list-item-content>

                  <v-list-item-action>
                    <!-- <v-btn icon @click="deleteEvent(event)">
                  <v-icon color="grey lighten-1">mdi-delete</v-icon>
                </v-btn> -->
                  </v-list-item-action>
                </v-list-item>
              </v-list-item-group>
            </v-list>
            <v-text-field
              v-model="event_name"
              label="إسم الحدث"
            />
            <v-btn @click="createEvent">
              إضافة
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-container>
  </v-card>
</template>
<script>
export default {
  name: 'Maintainence',
  data () {
    return {
      states: {},
      event_name: null,
      eventTypes: {},
      state_name: null
    }
  },
  mounted () {
    this.fetchStates()
    this.fetchEventTypes()
  },
  methods: {
    fetchStates () {
      this.$axios.get('/admin/settings/maintainence/state').then((response) => {
        this.states = response.data
      })
    },
    changeColor (id, color) {
      const data = {
        id,
        color
      }
      this.$axios.post('/admin/settings/maintainence/event/color', data).then(() => {
        this.fetchEventTypes()
      })
    },
    changeStateColor (id, color) {
      const data = {
        id,
        color
      }
      this.$axios.post('/admin/settings/maintainence/state/color', data).then(() => {
        this.fetchStates()
      })
    },
    deleteState (state) {
      this.$swal.fire({
        title: 'هل انت متأكد',
        text: `هل تريد حذف الحالة : ${state.state_name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم احذف'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.delete('/admin/settings/maintainence/state', { data: { id: state.id } }).then((response) => {
            console.log(response.data)
            this.$swal.fire(
              'تم الحذف',
              'تم حذف الحاله',
              'success'
            )
          }).catch((err) => {
            if ((err.response.status) === '422') {
              this.$store.dispatch('notify', 'لا يمكن حذف الحالة الافتراضية')
            } else {
              this.$store.dispatch('notify', err.response.errors)
            }
          })
        } else {
          this.$swal.fire(
            'تم الالغاء',
            'تم الغاء الطلب',
            'info'
          )
        }
      })
    },
    createState () {
      this.$axios.post('/admin/settings/maintainence/state', { state_name: this.state_name }).then(() => {
        this.fetchStates()
        this.state_name = null
        this.$store.dispatch('notify', 'تم الاضافة بنجاح')
      })
    },
    fetchEventTypes () {
      this.$axios.get('/admin/settings/maintainence/event').then((response) => {
        this.eventTypes = response.data
      })
    },
    deleteEvent (state) {
      this.$swal.fire({
        title: 'هل انت متأكد',
        text: `هل تريد حذف الحالة : ${state.state_name}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم احذف'
      }).then((result) => {
        if (result.isConfirmed) {
          this.$axios.delete('/admin/settings/maintainence/event', { data: { id: state.id } }).then((response) => {
            console.log(response.data)
            this.$swal.fire(
              'تم الحذف',
              'تم حذف الحاله',
              'success'
            )
          }).catch((err) => {
            if ((err.response.status) === '422') {
              this.$store.dispatch('notify', 'لا يمكن حذف الحدث الافتراضي')
            } else {
              this.$store.dispatch('notify', err.response.errors)
            }
          })
        } else {
          this.$swal.fire(
            'تم الالغاء',
            'تم الغاء الطلب',
            'info'
          )
        }
      })
    },
    createEvent () {
      this.$axios.post('/admin/settings/maintainence/event', { event_name: this.event_name }).then(() => {
        this.fetchEventTypes()
        this.event_name = null
        this.$store.dispatch('notify', 'تم الاضافة بنجاح')
      })
    }
  }
}
</script>
