const actions = {
    /*
    Connects to Firestore for ALL Sidebars for a single Group
    @TODO: filter these to only open sidebars
    */
    async listenSidebars({ commit }, GroupID) {
        // check the required input
        if (!GroupID) {
            return
        }
        commit('BAG_SIDEBARS_SET', [])
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Sidebars').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let sidebar = change.doc.data()
                sidebar.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_SIDEBARS_ADD', sidebar)
                        break;
                    case 'modified':
                        commit('BAG_SIDEBARS_REMOVE', sidebar)
                        commit('BAG_SIDEBARS_ADD', sidebar)
                        break;
                    case 'removed':
                        commit('BAG_SIDEBARS_REMOVE', sidebar)
                        break;
                    default:
                        // @TODO: handle this is a more official capacity
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + sidebar.id)
                        console.log(sidebar)
                }
            })
        })
    },
    /*
    Connect and listen to a single sidebar
    */
    async listenSidebar({ context }, { GroupID, SidebarID }) {
        commit('BAG_SIDEBAR_SET', {})
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Sidebars').doc(SidebarID).onSnapshot((doc) => {
                var Sidebar = doc.data()
                commit('BAG_SIDEBAR_SET', doc.data())
            })
    },
    /*
        Let's create a new Sidebar doc(sub collection) in the bagGroups collection
    */
    async Add({ context }, { GroupID, Sidebar }) {
        // @TODO: do some validation here
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Sidebar) {
            console.log('If you do not pass a Sidebar, we can not create it!')
            return
        }
        // insert a new sidebar into the bagGroup subcollection
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Sidebars').add(Sidebar).then((docRef) => {
                Sidebar.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the sidebar:", error);
            });
    },
    /*
        Update an existing Sidebar
    */
    async Update({ context }, { GroupID, SidebarID, Sidebar }) {
        // @TODO
    },
    /*
         Remove an existing Sidebar
    */
    async Remove({ context }, { GroupID, SidebarID }) {
        console.log('bagSidebars.actions.Remove(GroupID, SidebarID):' + GroupID + ':' + SidebarID)
        return
    }
}
const mutations = {
    BAG_SIDEBARS_SET(state, sidebars) {
        state.Sidebars = sidebars
    },
    BAG_SIDEBARS_ADD(state, sidebar) {
        state.Sidebars.push(sidebar)
    },
    BAG_SIDEBARS_REMOVE(state, sidebar) {
        // filter the existing bagGroups.Sidebars to exclude the one to be removed
        let NewSidebars = state.Sidebars.filter(element => element.id != sidebar.id)
        // set the state to this new array
        state.Sidebars = NewSidebars
    },
    BAG_SIDEBAR_SET(state, sidebar) {
        state.Sidebar = sidebar
    },
}
const getters = {
    getByID: (state) => (sidebarID) => {
        let tmpSidebar = state.Sidebars.find(element => element.id === sidebarID)
        if (!tmpSidebar) { return {} }
        return tmpSidebar
    },
}
const state = () => ({
    Sidebars: [],
    Sidebar: { Reason: '', RequestedBy: {}, RequestedOf: {}, Status: '', CreatedAt: '', ClosedAt: '' },
})

export default {
    state,
    actions,
    mutations,
    getters,
}