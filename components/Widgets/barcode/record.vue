<template>
  <div>
    <h3>منتج</h3>
    <v-list>
      <v-list-item>
        إسم العميل : {{ item.customer.name }}
      </v-list-item>
      <v-list-item>
        نوع الجهاز : {{ item.device.device_name }}
      </v-list-item>
      <v-list-item>
        عطل الجهاز : {{ item.problem }}
      </v-list-item>
      <v-list-item>
        الحالة : {{ item.state.state_name }}
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'Record',
  props: {
    item: {
      type: [Object, Array],
      required: true
    }
  }
}
</script>
