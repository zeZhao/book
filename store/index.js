import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		type: "",
		kindergartenId: "",
		info: {},
		user: {},
		classList:[]
	},
	getters: {

	},
	mutations: {
		setType(state, type) {
			state.type = type
		},
		setKindergartenId(state, kindergartenId) {
			state.kindergartenId = kindergartenId
		},
		setUser(state, user) {
			state.user = user
		},
		setInfo(state, info) {
			state.info = info
		},
		setClassList(state,list){
			state.classList = list
		}

	},
	actions: {

	}
})

export default store