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
        نقل بين المخازن
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="indigo"
        dark
      >
        نقل بين المخازن
      </v-toolbar>
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-select v-model="from" :items="inventories" item-text="inventory_name" item-value="id" label="نقل من" />
          </v-col>
          <v-col cols="4">
            <v-select v-model="to" :items="inventories" item-text="inventory_name" item-value="id" label="نقل الى" />
          </v-col>
          <v-col cols="4">
            <v-text-field v-model="quantity" label="الكمية المنقولة" />
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn
          color="success"
          @click="submitMove"
        >
          نقل
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  name: 'MoveStock',
  props: {
    modelId: {
      required: true,
      type: Number
    },
    modelType: {
      required: true,
      type: String
    },
    isPart: {
      type: Boolean,
      default: false
    },
    inventories: {
      required: true,
      type: [Array, Object]
    }
  },
  data () {
    return {
      from: null,
      to: null,
      dialog: false,
      quantity: null
    }
  },
  computed: {
    data () {
      return {
        model_id: this.modelId,
        from: this.from,
        to: this.to,
        quantity: this.quantity,
        type: this.modelType,
        is_part: this.isPart
      }
    }
  },
  mounted () {

  },
  methods: {
    submitMove () {
      this.axios.post('admin/inventories/stock/move', this.data).then(() => {
        this.dialog = false
        this.from = null
        this.to = null
        this.quantity = null
        this.$emit('dataChanged')
      }).catch((err) => {
        this.$store.dispatch('notify', err.response.data.message)
      })
    }
  }
}
</script>
