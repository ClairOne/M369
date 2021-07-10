const actions = {
    /* ROOT */
    async onAuthStateChangedAction(state, { authUser, claims }) {
        if (!authUser) {
            // remove state
            state.commit('SET_CurrentUser', null)

            //redirect from here
            this.$router.push({
                path: '/login',
            })
        } else {
            // set the CurrentUser
            const { uid, email, displayName } = authUser
            state.commit('SET_CurrentUser', {
                uid,
                email,
                displayName,
            })
        }
    },
}
const mutations = {}
const state = () => ({
    /* ROOT */
    CurrentUser: null,
    userProfile: null,
})
const getters = {}

export default {
    state,
    actions,
    mutations,
    getters,
}
