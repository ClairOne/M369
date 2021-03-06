const actions = {
    async groupsConnect({ context, dispatch }, force) {
        if (!force && this.state.bagGroups.Groups.length > 0) {
            return
        }
        dispatch('bagGroupsListen')
    },
    async bagGroupsListen({ commit }) {
        commit('BAG_GROUPS_SET', [])
        this.$fire.firestore.collection('bagGroups').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let group = change.doc.data()
                group.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_GROUPS_ADD', group)
                        break;
                    case 'modified':
                        commit('BAG_GROUPS_REMOVE', group)
                        commit('BAG_GROUPS_ADD', group)
                        break;
                    default:
                        // code block
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + group.id)
                        console.log(group)
                }
            })
        })
    },
}
const mutations = {
    BAG_GROUPS_SET(state, groups) {
        state.Groups = groups
    },
    BAG_GROUPS_ADD(state, group) {
        state.Groups.push(group)
    },
    BAG_GROUPS_REMOVE(state, group) {
        // filter the existing bagGroups.Groups to exclude the one to be removed
        let NewGroups = this.state.bagGroups.Groups.filter(element => element.id != group.id)
        // set the state to this new array
        this.state.bagGroups.Groups = NewGroups
    }
}
const getters = {
    bagGroups(state) {
        return state.bagGroups.Groups
    }
}
const state = {
    Groups: [],
    xGroups: [
        {
            id: 1,
            Title: 'M3 Elite',
            Description: 'Our core since Jan 2020',
            Facilitators: [
                {
                    DisplayName: 'Gary C',
                    Initials: 'GC',
                    FirstName: 'Gary',
                    LastName: 'Cartegena',
                    Email: 'dave+gary@clair.one',
                    id: 42,
                },
                {
                    DisplayName: 'Dave P',
                    Initials: 'DP',
                    FirstName: 'David',
                    LastName: 'Pomeroy',
                    Email: 'rwaters44@gmail.com',
                    id: 8,
                },
            ],
            Members: [
                { DisplayName: 'Dave P', Initials: 'DP' },
                { DisplayName: 'Omri B', Initials: 'OB' },
                { DisplayName: 'Cameron A', Initials: 'CA' },
            ],
            Icon: 'mdi-account',
        },
        {
            id: 2,
            Title: 'Wolf Pack',
            Description: 'Group Coaching',
            Facilitators: [
                {
                    DisplayName: 'Frankie F',
                    Initials: 'FF',
                    FirstName: 'Frankie',
                    LastName: 'Fihn',
                    Email: 'dave+frankie@clair.one',
                    id: 42,
                },
            ],
            Members: [
                { DisplayName: 'Dave P', Initials: 'DP' },
                { DisplayName: 'Jeff L', Initials: 'JL' },
                { DisplayName: 'Jenn B', Initials: 'JB' },
                { DisplayName: 'Hank F', Initials: 'HF' },
                { DisplayName: 'Andrea B', Initials: 'AB' },
                { DisplayName: 'Holy', Initials: 'HD' },
                { DisplayName: 'Larry D', Initials: 'LD' },
            ],
            Icon: 'mdi-account',
        },
    ],
}

export default {
    state,
    actions,
    mutations,
    getters,
}