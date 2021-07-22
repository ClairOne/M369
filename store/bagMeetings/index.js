const actions = {
    /*
    Connects to Firestore for ALL Meetings for a single Group
    - 21-07: It's a simple wrapper at the moment. It SHOULD check to see
            if the connection for the group is already active to avoid
            racking up Google Fees since the Meetings sub-collection
            could grow substantially.
            This MIGHT be a candidate for a static API call to a completed
            Meetings storage at some point.
    */
    async connect({ context, dispatch }, GroupID) {
        if (!GroupID) {
            console.log('<!-- Invalid GroupID:' + GroupID)
            return
        }
        dispatch('listen', GroupID)
    },
    async listen({ commit }, GroupID) {
        // check the required input
        if (!GroupID) {
            return
        }
        commit('BAG_MEETINGS_SET', [])
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Meetings').onSnapshot((res) => {
            const changes = res.docChanges()
            changes.forEach((change) => {
                let meeting = change.doc.data()
                meeting.id = change.doc.id
                switch (change.type) {
                    case 'added':
                        commit('BAG_MEETINGS_ADD', meeting)
                        break;
                    case 'modified':
                        commit('BAG_MEETINGS_REMOVE', meeting)
                        commit('BAG_MEETINGS_ADD', meeting)
                        break;
                    case 'removed':
                        commit('BAG_MEETINGS_REMOVE', meeting)
                        break;
                    default:
                        // @TODO: handle this is a more official capacity
                        console.log('<!-- unknown change type: (' + change.type + ') for: ' + meeting.id)
                        console.log(meeting)
                }
            })
        })
    },
    /*
    Connect and listen to a single meeting
    */
    async loadMeetingListener({ commit }, { GroupID, MeetingID }) {
        commit('BAG_MEETING_SET', {})
        console.log('<!-- attempting to listen to bagGroups/' + GroupID + '/Meetings/' + MeetingID)
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Meetings').doc(MeetingID).onSnapshot((doc) => {
                var Meeting = doc.data()
                commit('BAG_MEETING_SET', doc.data())
            })
    },
    /*
        Let's create a new Meeting doc(sub collection) in the bagGroups collection
    */
    async Add({ context }, { GroupID, Meeting }) {
        // @TODO: do some validation here
        if (!GroupID) {
            console.log('Invalid GroupID')
            return
        }
        if (!Meeting) {
            console.log('If you do not pass a Meeting, we can not create it!')
            return
        }
        // insert a new meeting into the bagGroup subcollection
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Meetings').add(Meeting).then((doc) => {
                Meeting.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the meeting:", error);
            });
    },
    async AddHigh({ commit }, { GroupID, MeetingID, newHigh }) {
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((doc) => {
            if (doc.exists) {
                const Meeting = doc.data()
                Meeting.Highs.push(newHigh)
                meetingRef.update({
                    Highs: Meeting.Highs
                })
            } else {
                // doc.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
}
const mutations = {
    BAG_MEETINGS_SET(state, meetings) {
        state.Meetings = meetings
    },
    BAG_MEETINGS_ADD(state, meeting) {
        state.Meetings.push(meeting)
    },
    BAG_MEETINGS_REMOVE(state, meeting) {
        // filter the existing bagGroups.Meetings to exclude the one to be removed
        let NewMeetings = this.state.Meetings.filter(element => element.id != meeting.id)
        // set the state to this new array
        state.Meetings = NewMeetings
    },
    BAG_MEETING_SET(state, meeting) {
        state.Meeting = meeting
    },
}
const getters = {
    getByID: (state) => (meetingID) => {
        let tmpMeeting = state.Meetings.find(element => element.id === meetingID)
        if (!tmpMeeting) { return {} }
        return tmpMeeting
    },
}
const state = {
    Meetings: [],
    Meeting: { Facilitator: {}, Attendees: [], Highs: [] },
}

export default {
    state,
    actions,
    mutations,
    getters,
}