export const state = () => ({
	table: false,
	name: '',
	group: '',
	email: ''
})

export const mutations = {
	validate (state) {
		state.table = true;
		//state.name = this.name;
	},
	updateMessage(state, name) {
    state.name = name
	},
	updateGroup(state, group) {
		state.group = group
	}
}