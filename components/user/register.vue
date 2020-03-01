<template>
  <v-card flat class="pa-2">
    <v-form ref="registrationForm" v-model="valid" class="mb-2">
			<div class="red--text">{{ errorMessage }}</div>
      <v-text-field
        :rules="usernameRules"
        label="Username"
        v-model="username"
				@keyup.enter="onEnter"
      />
      <v-text-field
        :rules="passwordRules"
        type="password"
        label="Password"
        v-model="password"
				@keyup.enter="onEnter"
      />
      <v-text-field
        :rules="repeatPasswordRules"
        type="password"
        label="Repeat Password"
        v-model="repeatPassword"
				@keyup.enter="onEnter"
      />
    </v-form>
    <v-btn :disabled="!valid" color="primary" @click="register">Register</v-btn>
  </v-card>
</template>

<script>
import { required, minLength, maxLength } from "../../shared/validation";
import { mapActions, mapMutations } from "vuex";

export default {
  data() {
    return {
      valid: false,
			errorMessage: null,
      username: null,
      password: null,
      repeatPassword: null,
      usernameRules: [required, maxLength(20)],
      passwordRules: [required, minLength(8)],
      repeatPasswordRules: [
        required,
        value => {
          const vm = this;

          return (
            (vm.password && vm.password === vm.repeatPassword) ||
            "Passwords must match"
          );
        }
      ]
    };
  },
  methods: {
    ...mapActions("user", ["registerService"]),
		...mapMutations("user", ["setUser"]),
    async register() {
      const vm = this;

      const response = await vm.registerService({
        username: vm.username,
        password: vm.password
      });

			if(response.data.error) {
				vm.errorMessage = response.data.error
			} else {
				vm.errorMessage = null

				const user = response.data

				localStorage.setItem("user", JSON.stringify(user))

				vm.setUser(user)

				vm.$emit("registrationComplete")
			}
			vm.$refs.registrationForm.resetValidation()
			vm.username = null;
			vm.password = null;
			vm.repeatPassword = null;
    },
		onEnter() {
			const vm = this;

			if(vm.$refs.registrationForm.validate()) {
				vm.register()
			}
		}
  }
};
</script>

<style></style>
