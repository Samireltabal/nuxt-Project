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
                  <img :src="user.avatar" alt="Avatar">
                </v-avatar>
                <v-btn
                  bordered
                  bottom
                  color="deep-purple accent-4"
                  overlap
                  icon
                  offset-x="55"
                  offset-y="55"
                  @click="$refs.file.click()"
                >
                  <v-icon>mdi-camera-plus</v-icon>
                </v-btn>
                <input ref="file" type="file" style="display: none" @change="updateAvatar">
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
              <v-btn color="primary" :loading="loading" @click.native="changeData">
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
              <v-btn color="primary" :loading="loading" @click="changePassword">
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
        name: null,
        phone: null,
        email: null
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
    updateAvatar () {
      // console.log(this.$refs.file.files[0])
      const form = new FormData()
      form.append('avatar', this.$refs.file.files[0])
      this.$axios.post('auth/avatar', form).then(() => {
        this.$toast.success('successfully updated')
        this.$auth.fetchUser()
      })
    },
    changePassword () {
      this.loading = true
      const data = {
        form_type: 'password',
        password: this.password.old,
        new_password: this.password.new,
        new_password_confirmation: this.password.new_confirmation
      }
      this.$axios.put('auth/user', data).then((response) => {
        this.$toast.success(response.data.message)
        this.loading = false
      }).catch((err) => {
        this.$toast.error(err.response.data.message)
        this.loading = false
      })
    },
    changeData () {
      this.loading = true
      const data = {
        form_type: 'data',
        name: this.form.name,
        phone: this.form.phone,
        email: this.form.email
      }
      this.$axios.put('auth/user', data).then((response) => {
        this.$toast.success('successfully updated')
        this.$auth.fetchUser()
        this.loading = false
      }).catch((err) => {
        this.$toast.error(err.response.data.message)
        this.loading = false
      })
    }
  }
}
</script>
