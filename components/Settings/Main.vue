<template>
  <v-container>
    <v-row>
      <v-col>
        <h3> الاعدادات الرئيسية </h3>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <h5>إعدادات افتراضية</h5>
        <span v-for="ditem in defaults" :key="ditem.name">
          <v-chip
            v-if="!checkIfSubmitted(ditem.name)"
            class="ma-2"
            color="cyan"
            label
            text-color="white"
          >
            <v-icon left @click="addDefaultItem(ditem)">
              mdi-plus
            </v-icon>
            {{ ditem.label }}
          </v-chip>
        </span>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12">
        <h4>الاعدادات</h4>
      </v-col>
      <v-col cols="12">
        <v-text-field
          v-for="item in settings"
          :key="item.name"
          v-model="item.val"
          :label="item.label"
          outlined
          :prepend-icon="item.icon"
          :class="item.class"
          :value="item.val"
          :hint="item.description"
          persistent-hint
          :type="item.type"
        >
          <template #append>
            <v-icon color="green" @click="submitItem(item)">
              mdi-check
            </v-icon>
          </template>
        </v-text-field>
      </v-col>
    </v-row>
    <v-row>
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <template #activator="{ on, attrs }">
          <v-btn
            color="primary"
            dark
            class="mb-5 mt-5"
            v-bind="attrs"
            v-on="on"
          >
            <v-icon>mdi-plus</v-icon> إضافة عنصر جديد
          </v-btn>
        </template>
        <v-card>
          <v-card-title>
            <span class="text-h5">إضافة عنصر جديد</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-select v-model="newItem.type" :items="types" label="Setting Type" />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="newItem.name"
                    label="Key"
                    persistent-hint
                    hint="key of setting field"
                  />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="newItem.label"
                    label="Label"
                    hint="Label of setting field"
                    persistent-hint
                    required
                  />
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="newItem.val"
                    label="Value"
                    required
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="newItem.description"
                    label="Description"
                    type="text"
                    required
                  />
                </v-col>
                <v-col
                  cols="12"
                  md="6"
                >
                  <v-select v-model="newItem.icon" :items="icons" label="Icon" />
                </v-col>
                <v-col
                  cols="12"
                  sm="6"
                  md="6"
                >
                  <v-text-field
                    v-model="newItem.class"
                    label="Custom Class"
                  />
                </v-col>
              </v-row>
            </v-container>
            <small>*indicates required field</small>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn
              color="error darken-1"
              text
              @click="closeDialog()"
            >
              الغاء
            </v-btn>
            <v-btn
              color="blue darken-1"
              dark
              @click="addNewItem"
            >
              إضافة
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </v-container>
</template>
<script>
export default {
  name: 'Main',
  data () {
    return {
      defaults: {},
      settings: {},
      dialog: false,
      newItem: {
        type: 'email',
        data: 'string',
        name: 'general_email',
        label: 'Contact Email',
        description: 'General Email for inquiries',
        icon: 'mdi-email',
        rules: 'required|min:2|max:50',
        class: 'w-auto px-2',
        val: 'sales@ehome3.com'
      },
      types: [
        'text',
        'email',
        'boolean'
      ],
      icons: [
        'mdi-cog',
        'mdi-email',
        'mdi-wrench',
        'mdi-phone'
      ]
    }
  },
  mounted () {
    this.fetchSettings()
  },
  methods: {
    fetchSettings () {
      this.$axios.get('/admin/settings').then((response) => {
        this.defaults = response.data.default
        this.settings = response.data.updated
      })
    },
    submitItem (item) {
      this.$axios.post('/admin/settings', item).then(() => {
        this.$store.dispatch('notify', 'تم التعديل بنجاح')
        this.fetchSettings()
      })
    },
    closeDialog () {
      this.dialog = false
      this.newItem = {
        type: null,
        data: null,
        name: null,
        label: null,
        description: null,
        icon: null,
        rules: null,
        class: null,
        val: null
      }
    },
    addDefaultItem (item) {
      item.val = item.value
      this.$axios.post('/admin/settings', item).then(() => {
        this.$store.dispatch('notify', 'تم التعديل بنجاح')
        this.fetchSettings()
      })
    },
    addNewItem () {
      const item = this.newItem
      this.$axios.post('/admin/settings', item).then(() => {
        this.$store.dispatch('notify', 'تم التعديل بنجاح')
        this.fetchSettings()
        this.closeDialog()
      })
    },
    checkIfSubmitted (item) {
      const obj = this.settings
      return obj.find(function (v) { return v.name === item })
    }
  }
}
</script>
