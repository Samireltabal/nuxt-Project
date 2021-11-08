<template>
  <v-card>
    <v-toolbar
      color="primary darken-1"
      dark
      tile
      flat
    >
      <v-toolbar-title>الإعدادات</v-toolbar-title>

      <v-spacer />

      <!-- <v-btn icon>
        <v-icon>mdi-magnify</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>mdi-dots-vertical</v-icon>
      </v-btn> -->

      <template #extension>
        <v-tabs
          v-model="tab"
          align-with-title
        >
          <v-tabs-slider color="yellow" />

          <v-tab
            v-for="item in items"
            :key="item.id"
          >
            {{ item.text }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

    <v-tabs-items v-model="tab">
      <v-tab-item
        v-for="item in items"
        :key="item.id"
      >
        <v-lazy>
          <component :is="item.component" />
        </v-lazy>
      </v-tab-item>
    </v-tabs-items>
  </v-card>
</template>
<script>
import Main from '../../../components/Settings/Main.vue'
import Maintainence from '../../../components/Settings/Maintainence.vue'

export default {
  name: 'Settings',
  layout: 'admin',
  data () {
    return {
      tab: null,
      items: [
        { id: 0, text: 'الاعدادات الاساسية', component: Main },
        { id: 1, text: 'الصيانة', component: Maintainence },
        { id: 2, text: 'المبيعات', component: Maintainence },
        { id: 3, text: 'الرسائل', component: Maintainence },
        { id: 4, text: 'اخرى', component: Maintainence }
      ],
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  }
}
</script>
