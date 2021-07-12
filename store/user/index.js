const actions = {
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
const mutations = {
    SET_CurrentUser(state, user) {
        state.CurrentUser = user
    },
}
const state = () => ({
    CurrentUser: null,
    userProfile: null,
})
const getters = {
    // we don't use getters at this time. Just read the state directly
}

export default {
    state,
    actions,
    mutations,
    getters,
}
