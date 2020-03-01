export const state = () => {
	return {
		user: null
	}
}

export const actions = {
  registerService({ commit }, { username, password }) {
		const vm = this;

    return vm.$axios({
			method: "POST",
			url: "/api/user",
			data: {username, password},
			headers: { "Content-Type": "application/json" }
		}).catch(err => {
			alert("ERROR")
			console.log(err)
		})
  },
	loginService({ commit }, { username, password }) {
		const vm = this

		return vm.$axios({
			method: "POST",
			url: "/api/user/login",
			data: {username, password},
			headers: { "Content-Type": "application/json" }
		}).catch(err => {
			alert("ERROR")
			console.log(err)
		})
	},
	logoutService({ commit }) {
		const vm = this;

		localStorage.removeItem("user")
		commit("setUser", null)

		vm.$router.push("/")
	}
}

export const mutations = {
	setUser(state, user) {
		state.user = user
	}
}
