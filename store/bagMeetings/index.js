const actions = {
    /*
    Connects to Firestore for ALL Meetings for a single Group
    */
    async listenMeetings({ commit }, GroupID, force = false) {
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
    async listenMeeting({ commit }, { GroupID, MeetingID }) {
        commit('BAG_MEETING_SET', {})
        this.$fire.firestore.collection('bagGroups').doc(GroupID)
            .collection('Meetings').doc(MeetingID).onSnapshot((doc) => {
                let Meeting = doc.data()
                Meeting.id = MeetingID
                commit('BAG_MEETING_SET', Meeting)
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
            .collection('Meetings').add(Meeting).then((docRef) => {
                Meeting.id = docRef.id
            }).catch((error) => {
                console.log("Error creating the meeting:", error);
            });
    },
    /*
        We don't do Remove at this time due to sub-collections
    */
    async Remove({ context }, { GroupID, MeetingID }) {
        console.log('bagMeetings.Remove(GroupID, MeetingID):' + GroupID + ':' + MeetingID)
        return
    },
    /*
        Assign the Facilitator
    */
    async AssignFacilitator({ commit }, { GroupID, MeetingID, Facilitator }) {
        if (!GroupID) { return }
        if (!MeetingID) { return }
        if (!Facilitator || !Facilitator.Email) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the facilitator @TODO: create a generic function for this to ensure map standardization
                const tmpFacilitator = {
                    DisplayName: Facilitator.DisplayName,
                    Email: Facilitator.Email,
                    FirstName: Facilitator.FirstName,
                    Initials: Facilitator.Initials,
                    LastName: Facilitator.LastName,
                }
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Facilitator: tmpFacilitator
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Assign the Facilitator
    */
    async AddAttendee({ commit }, { GroupID, MeetingID, Attendee }) {
        if (!GroupID || !MeetingID || !Attendee || !Attendee.Email) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the facilitator @TODO: create a generic function for this to ensure map standardization
                const newAttendee = {
                    DisplayName: Attendee.DisplayName,
                    Email: Attendee.Email,
                    FirstName: Attendee.FirstName,
                    Initials: Attendee.Initials,
                    LastName: Attendee.LastName,
                }
                const Meeting = docRef.data()
                // here's where we insert the attendee
                Meeting.Attendees.push(newAttendee)
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Attendees: Meeting.Attendees
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Remove an Attendee from the Meeting.Attendees array
    */
    async RemoveAttendee({ context }, { GroupID, MeetingID, Attendee }) {
        if (!GroupID || !MeetingID || !Attendee || !Attendee.Email) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // let's build a new list of Attendees without the one to be removed
                let tmpAttendees = Meeting.Attendees
                tmpAttendees = tmpAttendees.filter((item) => {
                    return (item.Email != Attendee.Email)
                })
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Attendees: tmpAttendees
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Add a high map to the Meeting.Highs array
    */
    async AddHigh({ context }, { GroupID, MeetingID, High }) {
        if (!GroupID || !MeetingID || !High) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the Attendee @TODO: create a generic function for this to ensure map standardization
                const newHigh = {
                    IsHigh: High.IsHigh,
                    Member: High.Member, //@TODO: this is where it would be nice to call that function I mentioned above
                    Title: High.Title,
                }
                const Meeting = docRef.data()
                // here's where we insert the newHigh
                Meeting.Highs.push(newHigh)
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Highs: Meeting.Highs
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Remove a High from the Meeting.Highs array
    */
    async RemoveHigh({ context }, { GroupID, MeetingID, High }) {
        if (!GroupID || !MeetingID || !High) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // let's build a new list of highs without the one to be removed
                let tmpHighs = Meeting.Highs
                tmpHighs = tmpHighs.filter((item) => {
                    return (item.MemberEmail != High.MemberEmail || item.Title != High.Title)
                })
                // here's where we actually remove the high
                meetingRef.update({
                    Highs: tmpHighs
                })
                // Vuex/Firestore takes care of the rest
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    /*
        Sets the StartedAt timestamp
    */
    async Start({ context }, { GroupID, MeetingID }) {
        if (!GroupID || !MeetingID) { return }
        // create the timestamp (we don't want to use the format used by FS)
        const current = new Date()
        const tmpStartedAt = `${current.getFullYear()}-${current.getMonth() + 1
            }-${current.getDate()} ${current.getHours()}:${current.getMinutes()}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // here's where we actually update the Meeting
                meetingRef.update({
                    StartedAt: tmpStartedAt
                })
                // Vuex/Firestore takes care of the rest
            } else {
                // docRef.data() will be undefined in this case
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
        let NewMeetings = state.Meetings.filter(element => element.id != meeting.id)
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
const state = () => ({
    Meetings: [],
    Meeting: { Facilitator: {}, Attendees: [], Highs: [] },
})

export default {
    state,
    actions,
    mutations,
    getters,
}