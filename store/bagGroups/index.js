const actions = {
    async connect({ context, dispatch }, force) {
        if (!force && this.state.bagGroups.Groups.length > 0) {
            return
        }
        dispatch('listen')
    },
    async listen({ commit }) {
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
    /*
    Connect and listen to a single meeting
    */
    async loadGroupListener({ context, commit }, GroupID) {
        commit('BAG_GROUP_SET', {})
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .onSnapshot((doc) => {
                commit('BAG_GROUP_SET', doc.data())
            })
    },
    async bagGroupsAdd({ state }, { Group }) {
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
            .catch((error) => {
                console.error('<!-- Error updating document: ', error);
                return
            });
    },
    /*
        21-07-14:
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
    BAG_GROUP_SET(state, group) {
        state.Group = group
    }
}
const getters = {
    getByID: (state) => (groupID) => {
        let tmpGroup = state.Groups.find(element => element.id === groupID)
        if (!tmpGroup) { return {} }
        return tmpGroup
    },
}
const state = {
    Groups: [],
    Group: {},
}

export default {
    state,
    actions,
    mutations,
    getters,
}