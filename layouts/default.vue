<template>
  <v-app dark>
    <nuxt-child />
  </v-app>
</template>

<script>
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      fixed: false
    };
  },
  computed: {
    ...mapState("user", ["user"])
  },
  methods: {
    ...mapMutations("user", ["setUser"])
  },
  mounted() {
    const vm = this;

    const user = JSON.parse(localStorage.getItem("user"));

    if (user && !vm.user) {
      vm.setUser(user);
      vm.$router.push("/todos");
    } else {
      if (vm.$route.path !== "/") {
        vm.$router.push("/");
      }
    }
  }
};
</script>

<style>
	.pointer:hover {
		cursor: pointer
	}
</style>
