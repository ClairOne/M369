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
                    case 'removed':
                        commit('BAG_GROUPS_REMOVE', group)
                        break;
                    default:
                        // code block
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + group.id)
                        console.log(group)
                }
            })
        })
    },
    async bagGroupsAdd({ commit }, { Group }) {
        // @TODO: do some validation here so we are not relying on the forms alone
        if (!Group) {
            console.log('If you do not pass a Group, we can not Add it!')
            return
        }
        const NewGroup = {
            Title: Group.Title,
            Description: Group.Description,
            Icon: Group.Icon,
            Facilitators: Group.Facilitators,
            Members: Group.Members,
            Owner: Group.Owner,
        }
        this.$fire.firestore.collection('bagGroups').add(NewGroup)
            .then((docRef) => {
                Group.id = docRef.id
            })
            .catch((error) => {
                return
            });
    },

    async bagGroupsUpdate({ state }, { GroupID, Group }) {
        // @TODO: do some validation here so we are not relying on the forms alone
        if (!Group) {
            console.log('If you do not pass a Group, we can not Update it!')
            return
        }
        // update the document
        // no mutations since the active listeners will pass on the update info
        this.$fire.firestore.collection('bagGroups')
            .doc(GroupID)
            .update(Group)
            .then(() => {
                console.log('<!-- Document updated with ID: ', GroupID);
            })
            .catch((error) => {
                console.error('<!-- Error updating document: ', error);
                return
            });
    },
    /*
        All this does is add an item to the Group.Members or Group.Facilitators array
        at this time. We'll need to link this to UserProfiles
    */
    async bagGroupMemberAdd({ state }, { GroupID, Member, isFacilitator }) {
        // @TODO: do some validation here
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Member) {
            console.log('If you do not pass a Member, we can not add them!')
            return
        }
        // fetch the document
        const bagGroupsRef = this.$fire.firestore.collection("bagGroups")
        const groupRef = bagGroupsRef.doc(GroupID);
        groupRef.get().then((doc) => {
            if (doc.exists) {
                const Group = doc.data()
                if (isFacilitator) {
                    Group.Facilitators.push(Member)
                    groupRef.update({
                        Facilitators: Group.Facilitators
                    })
                } else {
                    Group.Members.push(Member)
                    groupRef.update({
                        Members: Group.Members
                    })
                }
            } else {
                // doc.data() will be undefined in this case
                console.log("Invalid Group!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
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
    },
}
const getters = {
    getGroupByID: (state) => (groupID) => {
        let tmpGroup = state.Groups.find(element => element.id === groupID)
        if (!tmpGroup) { return {} }
        return tmpGroup
    },
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