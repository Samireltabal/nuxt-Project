<template>
  <div>
    <h3>منتج</h3>
    <v-list>
      <v-list-item>
        إسم المنتج : {{ item.product_name }}
      </v-list-item>
      <v-list-item>
        سعر البيع : {{ item.original_price }}
      </v-list-item>
      <v-list-item>
        الكمية المتوفرة :
        <v-list>
          <v-list-item v-for="(value, key) in item.stock" :key="key">
            {{ key }} : {{ value }}
          </v-list-item>
        </v-list>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  name: 'Product',
  props: {
    item: {
      type: [Object, Array],
      required: true
    }
  }
}
</script>
