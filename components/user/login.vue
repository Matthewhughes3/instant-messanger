<template>
  <v-card class="pa-2 elevation-2" flat dark>
    <center>
      <h2>Login</h2>
      <v-form v-model="valid" ref="loginForm">
				<div class="red--text">{{ errorMessage }}</div>
        <v-text-field
          :rules="usernameRules"
          label="Username"
          v-model="username"
          @keyup.enter="onEnter"
        />
        <v-text-field
          :rules="passwordRules"
          label="Password"
          type="password"
          v-model="password"
          @keyup.enter="onEnter"
        />
      </v-form>
      <v-btn :disabled="!valid" color="primary" @click="login">Login</v-btn>
      <div class="mt-5">
        Don't have an account?
        <v-btn class="ml-3" text @click="openRegistration">Register</v-btn>
      </div>
    </center>
    <popup
      v-model="registrationDialog"
      title="Register"
      headerCancel
      hideFooter
    >
      <register @registrationComplete="registrationComplete" />
    </popup>
  </v-card>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import { required } from "../../shared/validation";
import Popup from "../shared/popup";
import Register from "../user/register";

export default {
  data() {
    return {
      valid: false,
      registrationDialog: false,
      username: null,
      password: null,
      usernameRules: [required],
      passwordRules: [required],
			errorMessage: null
    };
  },
  components: {
    popup: Popup,
    register: Register
  },
  methods: {
    ...mapActions("user", ["loginService"]),
    ...mapMutations("user", ["setUser"]),
    async login() {
      const vm = this;

      const response = await vm.loginService({
        username: vm.username,
        password: vm.password
      });

			if(response.data.error) {
				vm.errorMessage = response.data.error
			} else {
				vm.errorMessage = null

				const user = response.data;

				localStorage.setItem("user", JSON.stringify(user));
				vm.setUser(user);

				vm.$router.push("/todos");
			}

    },
    openRegistration() {
      const vm = this;

      vm.registrationDialog = true;
    },
    closeRegistration() {
      const vm = this;

      vm.registrationDialog = false;
    },
    registrationComplete() {
      const vm = this;

      vm.closeRegistration();

      vm.$router.push("/todos");
    },
    onEnter() {
      const vm = this;

      if (vm.$refs.loginForm.validate()) {
        vm.login();
      }
    }
  }
};
</script>

<style></style>
