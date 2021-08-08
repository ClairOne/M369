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
    /*
        Set the CurrentHighs for a bagGroups.Member document
    */
    async SetCurrentHighs({ context }, { GroupID, MemberID, Highs }) {
        console.log('SetCurrentHighs(GroupID, Member, Highs')
        console.log('GroupID:' + GroupID)
        console.log('MemberID:' + MemberID)
        console.log('Highs:')
        console.log(Highs)
        if (!GroupID || !MemberID) {
            console.log('Invalid Member')
            return
        }
        // @TODO: might want to consider a validator at some point
        if (!Highs) {
            console.log('Invalid Highs')
            return
        }
        // fetch the document
        const memberRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Members').doc(MemberID)
        memberRef.get().then((docRef) => {
            if (docRef.exists) {
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                memberRef.update({
                    CurrentHighs: Highs
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Member!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Set the CurrentGoals for a bagGroups.Member document
    */
    async SetCurrentGoals({ context }, { GroupID, MemberID, Goals }) {
        console.log('SetCurrentGoals(GroupID, Member, Goals')
        console.log('GroupID:' + GroupID)
        console.log('MemberID:' + MemberID)
        console.log('Goals:')
        console.log(Goals)
        if (!GroupID || !MemberID) {
            console.log('Invalid Member')
            return
        }
        // @TODO: might want to consider a validator at some point
        if (!Goals) {
            console.log('Invalid Goals')
            return
        }
        // fetch the document
        const memberRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Members').doc(MemberID)
        memberRef.get().then((docRef) => {
            if (docRef.exists) {
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                memberRef.update({
                    CurrentGoals: Goals
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Member!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Set the CurrentGoals for a bagGroups.Member document
    */
    async SetCurrentSidebars({ context }, { GroupID, MemberID, Sidebars }) {
        console.log('SetCurrentSidebars(GroupID, MemberID, Sidebars')
        console.log('GroupID:' + GroupID)
        console.log('MemberID:' + MemberID)
        console.log('Sidebars:')
        console.log(Sidebars)
        if (!GroupID || !MemberID) {
            console.log('Invalid Member')
            return
        }
        // @TODO: might want to consider a validator at some point
        if (!Sidebars) {
            console.log('Invalid Sidebars')
            return
        }
        // fetch the document
        const memberRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Members').doc(MemberID)
        memberRef.get().then((docRef) => {
            if (docRef.exists) {
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                memberRef.update({
                    CurrentSidebars: Sidebars
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Member!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Set the CurrentRoadblocks for a bagGroups.Member document
    */
    async SetCurrentRoadblocks({ context }, { GroupID, MemberID, Roadblocks }) {
        if (!GroupID || !MemberID) {
            console.log('Invalid Member')
            return
        }
        // @TODO: might want to consider a validator at some point
        if (!Roadblocks) {
            console.log('Invalid Roadblocks')
            return
        }
        // fetch the document
        const memberRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Members').doc(MemberID)
        memberRef.get().then((docRef) => {
            if (docRef.exists) {
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                memberRef.update({
                    CurrentRoadblocks: Roadblocks
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Member!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
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