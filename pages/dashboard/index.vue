<template>
  <v-container>
    <v-layout column>
      <v-row>
        <v-col>
          <v-card>
            <v-card-title>
              تغيير بيانات الحساب
            </v-card-title>
            <v-card-text>
              <v-flex class="mb-4">
                <v-avatar size="96" class="mr-4">
                  <img :src="'https://i.pravatar.cc/300'" alt="Avatar">
                </v-avatar>
                <v-btn @click="openAvatarPicker">
                  Change Avatar
                </v-btn>
              </v-flex>
              <v-text-field
                v-model="form.name"
                label="الإسم"
              />
              <v-text-field
                v-model="form.phone"
                label="الهاتف"
              />
              <v-text-field
                v-model="form.email"
                label="البريد الالكتروني"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :loading="loading" @click.native="update">
                <v-icon left dark>
                  mdi-check
                </v-icon>
                تعديل
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <v-col>
          <v-card>
            <v-card-title>
              تغيير كلمة السر
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="password.old"
                type="password"
                prepend-icon="mdi-lock"
                label="كلمة المرور السابقة"
              />
              <v-text-field
                v-model="password.new"
                type="password"
                prepend-icon="mdi-lock"
                label="كلمة المرور الجديدة"
              />
              <v-text-field
                v-model="password.new_confirmation"
                type="password"
                prepend-icon="mdi-lock"
                label="تأكيد كلمة المرور الجديدة"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" :loading="loading" @click.native="update">
                <v-icon left dark>
                  mdi-check
                </v-icon>
                تعديل
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-layout>
    <!-- <avatar-picker
      v-model="showAvatarPicker"
      :current-avatar="form.avatar"
      @selected="selectAvatar"
    /> -->
  </v-container>
</template>

<script>
export default {
  pageTitle: 'My Profile',
  data () {
    return {
      loading: false,
      form: {
        name: 'John',
        phone: 'Doe',
        email: 'john@doe.com'
      },
      password: {
        old: null,
        new: null,
        new_confirmation: null
      },
      showAvatarPicker: false
    }
  },
  computed: {
    user () {
      return this.$store.state.auth.user
    }
  },
  mounted () {
    this.form = {
      name: this.user.name,
      phone: this.user.phone,
      email: this.user.email
    }
  },
  methods: {
    openAvatarPicker () {
      this.showAvatarPicker = true
    },
    selectAvatar (avatar) {
      this.form.avatar = avatar
    }
  }
}
</script>
