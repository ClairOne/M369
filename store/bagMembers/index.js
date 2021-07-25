const actions = {
    /*
    Connects to Firestore for ALL Members for a single Group
    */
    async listenMembers({ commit }, GroupID) {
        // check the required input
        if (!GroupID) {
            return
        }
        commit('BAG_MEMBERS_SET', [])
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Members').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let Member = change.doc.data()
                Member.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_MEMBERS_ADD', Member)
                        break;
                    case 'modified':
                        commit('BAG_MEMBERS_REMOVE', Member)
                        commit('BAG_MEMBERS_ADD', Member)
                        break;
                    case 'removed':
                        commit('BAG_MEMBERS_REMOVE', Member)
                        break;
                    default:
                        // @TODO: handle this is a more official capacity
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + Member.id)
                        console.log(Member)
                }
            })
        })
    },
    /*
        Let's create a new Member doc(sub collection) in the bagGroups collection
    */
    async Add({ context }, { GroupID, Member }) {
        // @TODO: do some validation here
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Member) {
            console.log('If you do not pass a Member, we can not create it!')
            return
        }
        // adding this helps standardize the Member document
        const NewMember = {
            DisplayName: Member.DisplayName,
            FirstName: Member.FirstName,
            LastName: Member.LastName,
            Initials: Member.Initials,
            Email: Member.Email,
        }
        // insert a new Member into the bagGroup subcollection
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Members').add(NewMember).then((docRef) => {
                Member.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the Member:", error);
            });
    },
}
const mutations = {
    BAG_MEMBERS_SET(state, Members) {
        state.Members = Members
    },
    BAG_MEMBERS_ADD(state, Member) {
        state.Members.push(Member)
    },
    BAG_MEMBERS_REMOVE(state, Member) {
        // filter the existing bagGroups.Members to exclude the one to be removed
        let NewMembers = state.Members.filter(element => element.id != Member.id)
        // set the state to this new array
        state.Members = NewMembers
    },
    BAG_MEMBER_SET(state, Member) {
        state.Member = Member
    },
}
const getters = {
    getByID: (state) => (MemberID) => {
        let tmpMember = state.Members.find(element => element.id === MemberID)
        if (!tmpMember) { return {} }
        return tmpMember
    },
}
const state = () => ({
    Members: [],
    Member: {},
})

export default {
    state,
    actions,
    mutations,
    getters,
}