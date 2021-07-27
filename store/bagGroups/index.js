const actions = {
    async listenGroups({ commit }, { force = false }) {
        if (!force && this.state.bagGroups.Groups.length > 0) {
            return
        }
        commit('BAG_GROUPS_SET', [])
        this.$fire.firestore.collection('bagGroups').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let Group = change.doc.data()
                Group.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_GROUPS_ADD', Group)
                        break;
                    case 'modified':
                        commit('BAG_GROUPS_REMOVE', Group)
                        commit('BAG_GROUPS_ADD', Group)
                        break;
                    case 'removed':
                        commit('BAG_GROUPS_REMOVE', Group)
                        break;
                    default:
                        // @TODO: deal with this a better way.
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + Group.id)
                        console.log(Group)
                }
            })
        })
    },
    /*
    Connect and listen to a single Group
    */
    async listenGroup({ context, commit }, GroupID) {
        commit('BAG_GROUP_SET', {})
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .onSnapshot((doc) => {
                let Group = doc.data()
                Group.id = GroupID
                commit('BAG_GROUP_SET', Group)
            })
    },
    /*
        Create a new bagGroups document
    */
    async Add({ state }, { Group }) {
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
    /*
        Update an existing bagGroups document
    */
    async Update({ state }, { GroupID, Group }) {
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
        We don't do Remove at this time due to sub-collections
    */
    async Remove({ context }, { GroupID }) {
        console.log('bagGroups.Remove(GroupID):' + GroupID)
        return
    }
}
const mutations = {
    BAG_GROUPS_SET(state, Groups) {
        state.Groups = Groups
    },
    BAG_GROUPS_ADD(state, Group) {
        state.Groups.push(Group)
    },
    BAG_GROUPS_REMOVE(state, Group) {
        // filter the existing bagGroups.Groups to exclude the one to be removed
        let NewGroups = this.state.bagGroups.Groups.filter(element => element.id != Group.id)
        // set the state to this new array
        this.state.bagGroups.Groups = NewGroups
    },
    BAG_GROUP_SET(state, Group) {
        state.Group = Group
    }
}
const getters = {
    getByID: (state) => (GroupID) => {
        let tmpGroup = state.Groups.find(element => element.id === GroupID)
        if (!tmpGroup) { return {} }
        return tmpGroup
    },
}

const state = () => ({
    Groups: [],
    Group: {},
})


export default {
    state,
    actions,
    mutations,
    getters,
}