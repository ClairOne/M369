const actions = {
    /*
    Connects to Firestore for ALL Facilitators for a single Group
    */
    async listenFacilitators({ commit }, GroupID) {
        // check the required input
        if (!GroupID) {
            return
        }
        commit('BAG_FACILITATORS_SET', [])
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Facilitators').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let Facilitator = change.doc.data()
                Facilitator.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_FACILITATORS_ADD', Facilitator)
                        break;
                    case 'modified':
                        commit('BAG_FACILITATORS_REMOVE', Facilitator)
                        commit('BAG_FACILITATORS_ADD', Facilitator)
                        break;
                    case 'removed':
                        commit('BAG_FACILITATORS_REMOVE', Facilitator)
                        break;
                    default:
                        // @TODO: handle this is a more official capacity
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + Facilitator.id)
                        console.log(Facilitator)
                }
            })
        })
    },
    /*
        Let's create a new Facilitator doc(sub collection) in the bagGroups collection
    */
    async Add({ context }, { GroupID, Facilitator }) {
        console.log('bagFacilitators.Add(GroupID, Facilitator)')
        console.log(Facilitator)
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Facilitator) {
            console.log('If you do not pass a Facilitator, we can not create it!')
            return
        }
        // adding this helps standardize the Facilitator document
        const NewFacilitator = {
            DisplayName: Facilitator.DisplayName,
            FirstName: Facilitator.FirstName,
            LastName: Facilitator.LastName,
            Initials: Facilitator.Initials,
            Email: Facilitator.Email,
        }
        // insert a new Facilitator into the bagGroup subcollection
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Facilitators').add(NewFacilitator).then((docRef) => {
                Facilitator.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the Facilitator:", error);
            });
    },
}
const mutations = {
    BAG_FACILITATORS_SET(state, Facilitators) {
        state.Facilitators = Facilitators
    },
    BAG_FACILITATORS_ADD(state, Facilitator) {
        state.Facilitators.push(Facilitator)
    },
    BAG_FACILITATORS_REMOVE(state, Facilitator) {
        // filter the existing bagGroups.Facilitators to exclude the one to be removed
        let NewFacilitators = state.Facilitators.filter(element => element.id != Facilitator.id)
        // set the state to this new array
        state.Facilitators = NewFacilitators
    },
    BAG_FACILITATOR_SET(state, Facilitator) {
        state.Facilitator = Facilitator
    },
}
const getters = {
    getByID: (state) => (FacilitatorID) => {
        let tmpFacilitator = state.Facilitators.find(element => element.id === FacilitatorID)
        if (!tmpFacilitator) { return {} }
        return tmpFacilitator
    },
}
const state = () => ({
    Facilitators: [],
    Facilitator: {},
})

export default {
    state,
    actions,
    mutations,
    getters,
}