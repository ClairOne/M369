const actions = {
    /*
    Connects to Firestore for ALL Goals for a single Group
    @TODO: filter these to only open goals
    */
    async listenGoals({ commit }, GroupID) {
        // check the required input
        if (!GroupID) {
            return
        }
        commit('BAG_GOALS_SET', [])
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Goals').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let goal = change.doc.data()
                goal.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_GOALS_ADD', goal)
                        break;
                    case 'modified':
                        commit('BAG_GOALS_REMOVE', goal)
                        commit('BAG_GOALS_ADD', goal)
                        break;
                    case 'removed':
                        commit('BAG_GOALS_REMOVE', goal)
                        break;
                    default:
                        // @TODO: handle this is a more official capacity
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + goal.id)
                        console.log(goal)
                }
            })
        })
    },
    /*
    Connect and listen to a single goal
    */
    async listenGoal({ context }, { GroupID, GoalID }) {
        commit('BAG_GOAL_SET', {})
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Goals').doc(GoalID).onSnapshot((doc) => {
                var Goal = doc.data()
                commit('BAG_GOAL_SET', doc.data())
            })
    },
    /*
        Let's create a new Goal doc(sub collection) in the bagGroups collection
    */
    async Add({ context }, { GroupID, Goal }) {
        // @TODO: do some validation here
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Goal) {
            console.log('If you do not pass a Goal, we can not create it!')
            return
        }
        // insert a new goal into the bagGroup subcollection
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Goals').add(Goal).then((docRef) => {
                Goal.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the goal:", error);
            });
    },
    /*
        Update an existing Goal
    */
    async Update({ context }, { GroupID, GoalID, Goal }) {
        // @TODO
    },
    /*
         Remove an existing Goal
    */
    async Remove({ context }, { GroupID, GoalID }) {
        console.log('bagGoals.actions.Remove(GroupID, GoalID):' + GroupID + ':' + GoalID)
        return
    }
}
const mutations = {
    BAG_GOALS_SET(state, goals) {
        state.Goals = goals
    },
    BAG_GOALS_ADD(state, goal) {
        state.Goals.push(goal)
    },
    BAG_GOALS_REMOVE(state, goal) {
        // filter the existing bagGroups.Goals to exclude the one to be removed
        let NewGoals = state.Goals.filter(element => element.id != goal.id)
        // set the state to this new array
        state.Goals = NewGoals
    },
    BAG_GOAL_SET(state, goal) {
        state.Goal = goal
    },
}
const getters = {
    getByID: (state) => (goalID) => {
        let tmpGoal = state.Goals.find(element => element.id === goalID)
        if (!tmpGoal) { return {} }
        return tmpGoal
    },
}
const state = () => ({
    Goals: [],
    Goal: { Member: {}, Title: '', Status: '', CreatedAt: '', ClosedAt: '' },
})

export default {
    state,
    actions,
    mutations,
    getters,
}