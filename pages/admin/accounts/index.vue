<template>
  <v-layout app>
    <v-container>
      <v-row>
        <v-col cols="12">
          <h3>الحسابات</h3>
        </v-col>
        <v-col cols="12">
          <v-data-table
            :headers="headers"
            :items="posts.data"
            item-key="name"
            class="elevation-1"
          >
            <template #[`top`]>
              <v-text-field
                v-model="search"
                label="Search (UPPER CASE ONLY)"
                class="mx-4"
              />
            </template>
            <template #[`item.photo`]="{ item }">
              <v-avatar>
                <v-img :src="item.avatar" :alt="item.name" />
              </v-avatar>
            </template>
            <template #[`body.append`]>
              <tr>
                <td>
                  &nbsp;
                </td>
                <td>
                  <v-text-field
                    v-model="calories"
                    type="number"
                    label="Less than"
                  />
                </td>
                <td colspan="4">
                  &nbsp;
                </td>
              </tr>
            </template>
          </v-data-table>

          <v-btn @click="$fetch">
            Refresh
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-layout>
</template>
<script>
export default {
  name: 'Accounts',
  layout: 'admin',
  middleware: ['admin'],
  data: () => ({
    posts: [],
    headers: [
      { text: '#', value: 'photo' },
      { text: 'id', value: 'id' },
      { text: 'name', value: 'name' },
      { text: 'phone', value: 'phone' },
      { text: 'email', value: 'email' },
      { text: 'options', value: 'options' }
    ]
  }),
  async fetch () {
    this.posts = []
    this.posts = await this.$axios.$get('admin/accounts')
  }
}
</script>
