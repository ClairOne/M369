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
        this.$fire.firestore.collection('bagGroups').doc(GroupID).collection('Meetings').orderBy("MeetingDateTime", "desc").limit(10).onSnapshot((res) => {
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
        // @TODO: build a standard Meeting data model here
        const newMeeting = {
            MeetingDate: Meeting.MeetingDate,
            MeetingTime: Meeting.MeetingTime,
            MeetingDatTime: Meeting.MeetingDateTime,
            Attendees: Meeting.Attendees,
            Facilitator: Meeting.Facilitator, // @TODO: send this off to the Facilitator formatter
            PreviousHighs: [],
            Highs: Meeting.Highs,
            PreviousGoals: [],
            Goals: Meeting.Goals,
            PreviousSidebars: [],
            Sidbars: Meeting.Sidebars,
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
        Add a Goal to the Meeting.Goals array
    */
    async AddGoal({ context }, { GroupID, MeetingID, Goal }) {
        if (!GroupID || !MeetingID || !Goal) { return }
        // set the CreatedAt
        const tmpDate = new Date()
        const tmpCreatedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the Goal @TODO: create a generic function for this to ensure map standardization
                const newGoal = {
                    Member: Goal.Member, //@TODO: this is where it would be nice to call that function I mentioned above
                    Title: Goal.Title,
                    Status: Goal.Status,
                    CreatedAt: tmpCreatedAt,
                    Source: Goal.Source,
                    SourceType: Goal.SourceType
                }
                // do we have an existing values that shouldn't be overwritten?
                if (Goal.CreatedAt) { newGoal.CreatedAt = Goal.CreatedAt }
                if (Goal.Status) { newGoal.Status = Goal.Status }
                if (Goal.Source) { newGoal.Source = Goal.Source }
                if (Goal.SourceType) { newGoal.SourceType = Goal.SourceType }

                const Meeting = docRef.data()
                // Does Meeting.Goals exist?
                if (Meeting.Goals) {
                    // here's where we insert the newGoal
                    Meeting.Goals.push(newGoal)
                } else {
                    Meeting.Goals = [newGoal]
                }
                console.log('AddSidebar:Meeting.Goals:')
                console.log(Meeting.Goals)

                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Goals: Meeting.Goals
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
        Remove a Goal from the Meeting.Goals array
    */
    async RemoveGoal({ context }, { GroupID, MeetingID, Goal }) {
        if (!GroupID || !MeetingID || !Goal) { return }
        // is it a valid Goal.Member object?
        if (!Goal.Member || !Goal.Member.Email) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // let's build a new list of Goals without the one to be removed
                let tmpGoals = Meeting.Goals
                tmpGoals = tmpGoals.filter((item) => {
                    return (item.Member.Email != Goal.Member.Email || item.Title != Goal.Title)
                })
                // here's where we actually remove the Goal
                meetingRef.update({
                    Goals: tmpGoals
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
        Add Goals to the Meeting.PreviousGoals array
    */
    async addPreviousGoals({ context }, { GroupID, MeetingID, Goals }) {
        if (!GroupID || !MeetingID || !Goals) { return }
        // set the CreatedAt
        const tmpDate = new Date()
        const tmpCreatedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // We have 2 potential arrays: existing and new goals
                let newGoals = []
                let existingGoals = Meeting.PreviousGoals ? Meeting.PreviousGoals : []

                // process each goal and push them into newGoals
                Goals.forEach((Goal) => {
                    // Build the Goal @TODO: create a generic function for this to ensure map standardization
                    const newGoal = {
                        Member: Goal.Member, //@TODO: this is where it would be nice to call that function I mentioned above
                        Title: Goal.Title,
                        Status: Goal.Status,
                        CreatedAt: tmpCreatedAt,
                        Source: Goal.Source,
                        SourceType: Goal.SourceType
                    }
                    // do we have an existing values that shouldn't be overwritten?
                    if (Goal.CreatedAt) { newGoal.CreatedAt = Goal.CreatedAt }
                    if (Goal.Status) { newGoal.Status = Goal.Status }
                    if (Goal.Source) { newGoal.Source = Goal.Source }
                    if (Goal.SourceType) { newGoal.SourceType = Goal.SourceType }

                    // push it to the newGoals array
                    newGoals.push(newGoal)
                })

                // let's merge the 2 together
                // add newGoals to updateGoals
                let updateGoals = newGoals

                // push into the updateGoals the existing ones that aren't in this new batch
                existingGoals.forEach((existingGoal) => {
                    // find it in the updateGoals
                    let tmpGoal = updateGoals.find((item) => {
                        return (
                            item.Member.Email === existingGoal.Member.Email &&
                            item.Title === existingGoal.Title
                        )
                    })
                    if (!tmpGoal) {
                        // push it to the list
                        updateGoals.push(existingGoal)
                    }
                })
                /*
                    at this point we should have a clean set of updateGoals
                    with the newGoals and the existingGoals merged without duplicates
                */

                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    PreviousGoals: updateGoals
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
        Update the status of a PreviousGoal in Meeting.PreviousGoals
    */
    async SetPreviousGoalStatus({ context }, { GroupID, MeetingID, Goal, Status }) {
        if (!GroupID || !MeetingID || !Goal || !Status) { return }

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                const tmpPreviousGoals = Meeting.PreviousGoals


                // fetch the index of the item to be updated
                let tmpPreviousGoalIndex = tmpPreviousGoals.findIndex((item) => {
                    return (item.Member.Email === Goal.Member.Email && item.Title === Goal.Title)
                })

                // if we don't find it, stop processing
                if (tmpPreviousGoalIndex === -1) {
                    console.log('Action.SetPreviousGoalStatus: Invalid Previous Goal:' + tmpPreviousGoalIndex)
                    return
                }

                // buid a newGoal to avoid the vuex mutation issue
                let newGoal = {}
                for (const [key, value] of Object.entries(Goal)) {
                    newGoal[key] = value
                }
                // set the new status
                newGoal.Status = Status

                // splice in the new updated Goal
                tmpPreviousGoals.splice(tmpPreviousGoalIndex, 1, newGoal)
                // update the FS document
                meetingRef.update({
                    PreviousGoals: tmpPreviousGoals
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
        Add a Sidebar to the Meeting.Sidebars array
    */
    async AddSidebarx({ context }, { GroupID, MeetingID, Sidebar }) {
        console.log('AddSidebar(GroupID, MeetingID, Sidebar):' + GroupID + ':' + MeetingID)
        console.log(Sidebar)
        if (!GroupID || !MeetingID || !Sidebar) { return }
        // set the 
        const tmpDate = new Date()
        const tmpCreatedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the Sidebar @TODO: create a generic function for this to ensure map standardization
                const newSidebar = {
                    Reason: Sidebar.Reason,
                    //                    RequestedBy: Sidebar.RequestedBy, //@TODO: this is where it would be nice to call that function I mentioned above
                    //                    RequestedOf: Sidebar.RequestedOf,
                    Status: Sidebar.Status,
                    CreatedAt: tmpCreatedAt,
                    Source: Sidebar.Source,
                    SourceType: Sidebar.SourceType
                }
                console.log('newSidebar:')
                console.log(newSidebar)
                const Meeting = docRef.data()
                // Does Meeting.Sidebars exist?
                if (Meeting.Sidebars) {
                    // here's where we insert the newSidebar
                    Meeting.Sidebars.push(newSidebar)
                } else {
                    Meeting.Sidebars = [newSidebar]
                }
                console.log('Meeting.Sidebars:')
                console.log(Meeting.Sidebars)
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Sidebars: Meeting.Sidebars
                })
            } else {
                // docRef.data() will be undefined in this case
                console.log("Invalid Meeting!");
            }
        }).catch((error) => {
            console.log("Error getting document:", error);
        });
    },
    async AddSidebar({ context }, { GroupID, MeetingID, Sidebar }) {
        if (!GroupID || !MeetingID || !Sidebar) { return }
        // set the CreatedAt
        const tmpDate = new Date()
        const tmpCreatedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // Build the Sidebar @TODO: create a generic function for this to ensure map standardization
                const newSidebar = {
                    Reason: Sidebar.Reason,
                    RequestedBy: Sidebar.RequestedBy, //@TODO: this is where it would be nice to call that function I mentioned above
                    RequestedOf: Sidebar.RequestedOf,
                    Status: Sidebar.Status,
                    CreatedAt: tmpCreatedAt,
                    Source: Sidebar.Source,
                    SourceType: Sidebar.SourceType
                }
                // do we have an existing values that shouldn't be overwritten?
                if (Sidebar.CreatedAt) { newSidebar.CreatedAt = Sidebar.CreatedAt }
                if (Sidebar.Status) { newSidebar.Status = Sidebar.Status }
                if (Sidebar.Source) { newSidebar.Source = Sidebar.Source }
                if (Sidebar.SourceType) { newSidebar.SourceType = Sidebar.SourceType }

                const Meeting = docRef.data()
                // Does Meeting.Sidebars exist?
                if (Meeting.Sidebars && Meeting.Sidebars.length > 0) {
                    // here's where we insert the newSidebar
                    Meeting.Sidebars.push(newSidebar)
                } else {
                    Meeting.Sidebars = [newSidebar]
                }
                console.log('AddSidebar:Meeting.Sidebars:')
                console.log(Meeting.Sidebars)
                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    Sidebars: Meeting.Sidebars
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
        Remove a Sidebar from the Meeting.Sidebars array
    */
    async RemoveSidebar({ context }, { GroupID, MeetingID, Sidebar }) {
        if (!GroupID || !MeetingID || !Sidebar) { return }
        // is it a valid Sidebar.RequestedBy object?
        if (!Sidebar.RequestedBy || !Sidebar.RequestedBy.Email) { return }
        // is it a valid Sidebar.RequestedOf object?
        if (!Sidebar.RequestedOf || !Sidebar.RequestedOf.Email) { return }
        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // let's build a new list of Sidebars without the one to be removed
                let tmpSidebars = Meeting.Sidebars
                tmpSidebars = tmpSidebars.filter((item) => {
                    return (
                        item.RequestedBy.Email != Sidebar.RequestedBy.Email ||
                        item.RequestedOf.Email != Sidebar.RequestedOf.Email ||
                        item.Reason != Sidebar.Reason)
                })
                // here's where we actually remove the Sidebar
                meetingRef.update({
                    Sidebars: tmpSidebars
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
        Set Sidebar(s) to the Meeting.PreviousSidebars array
    */
    async AddPreviousSidebars({ context }, { GroupID, MeetingID, Sidebars }) {
        if (!GroupID || !MeetingID || !Sidebars) { return }
        // set the CreatedAt
        const tmpDate = new Date()
        const tmpCreatedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                // We have 2 potential arrays: existing and new
                let newSidebars = []
                let existingSidebars = Meeting.Sidebars ? Meeting.Sidebars : []

                // process each and push them into new
                Sidebars.forEach((Sidebar) => {
                    // Build the Object @TODO: create a generic function for this to ensure map standardization
                    const newSidebar = {
                        RequestedBy: Sidebar.RequestedBy, //@TODO: this is where it would be nice to call that function I mentioned above
                        RequestedOf: Sidebar.RequestedOf,
                        Reason: Sidebar.Reason,
                        CreatedAt: tmpCreatedAt,
                        Source: Sidebar.Source,
                        SourceType: Sidebar.SourceType
                    }
                    // do we have an existing values that shouldn't be overwritten?
                    if (Sidebar.CreatedAt) { newSidebar.CreatedAt = Sidebar.CreatedAt }
                    if (Sidebar.Source) { newSidebar.Source = Sidebar.Source }
                    if (Sidebar.SourceType) { newSidebar.SourceType = Sidebar.SourceType }

                    // push it to the new array
                    newSidebars.push(newSidebar)
                })
                // let's merge the 2 together
                let updateSidebars = newSidebars

                // merge into the update the existing ones that aren't in this new batch
                existingSidebars.forEach((existingSidebar) => {
                    // find it in the updateSidebars
                    let tmpSidebar = updateSidebars.find((item) => {
                        return (
                            item.RequestedBy.Email === existingSidebar.RequestedBy.Email &&
                            item.RequestedOf.Email === existingSidebar.RequestedOf.Email &&
                            item.Reason === existingSidebar.Reason
                        )
                    })
                    if (!tmpSidebar) {
                        // push it to the list
                        updateSidebars.push(existingSidebar)
                    }
                })
                /*
                    at this point we should have a clean set of updateSidebars
                    with the newSidebars and the existingSidebars merged without duplicates
                */

                // update FS document (Firestore & Vuex handles the rest with the listeners)
                meetingRef.update({
                    PreviousSidebars: updateSidebars
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
        Update the status of a PreviousSidebar in Meeting.PreviousSidebars
    */
    async SetPreviousSidebarStatus({ commit }, { GroupID, MeetingID, Sidebar, Status }) {
        if (!GroupID || !MeetingID || !Sidebar || !Status) { return }

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                const Meeting = docRef.data()
                const tmpPreviousSidebars = Meeting.PreviousSidebars


                // fetch the index of the item to be updated
                let tmpPreviousSidebarIndex = tmpPreviousSidebars.findIndex((item) => {
                    return (
                        item.RequestedBy.Email === Sidebar.RequestedBy.Email &&
                        item.RequestedOf.Email === Sidebar.RequestedOf.Email &&
                        item.Title === Sidebar.Title
                    )
                })

                // if we don't find it, stop processing
                if (tmpPreviousSidebarIndex === -1) {
                    console.log('Action.SetPreviousSidebarStatus: Invalid Previous Sidebar:' + tmpPreviousSidebarIndex)
                    return
                }

                // buid a newSidebar to avoid the vuex mutation issue
                let newSidebar = {}
                for (const [key, value] of Object.entries(Sidebar)) {
                    newSidebar[key] = value
                }
                // set the new status
                newSidebar.Status = Status

                // splice in the new updated Sidebar
                tmpPreviousSidebars.splice(tmpPreviousSidebarIndex, 1, newSidebar)
                // update the FS document
                meetingRef.update({
                    PreviousSidebars: tmpPreviousSidebars
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
        const tmpDate = new Date()
        const tmpStartedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

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
    /*
        Sets the ClosedAt timestamp
    */
    async Close({ context }, { GroupID, MeetingID }) {
        if (!GroupID || !MeetingID) { return }
        // create the timestamp (we don't want to use the format used by FS)
        const tmpDate = new Date()
        const tmpClosedAt = `${tmpDate.getFullYear()}-${tmpDate.getMonth() + 1
            }-${tmpDate.getDate()} ${tmpDate.getHours()}:${(
                '0' + tmpDate.getMinutes()
            ).slice(-2)}`

        // fetch the document
        const meetingRef = this.$fire.firestore.collection("bagGroups").doc(GroupID).collection('Meetings').doc(MeetingID)
        meetingRef.get().then((docRef) => {
            if (docRef.exists) {
                // here's where we actually update the Meeting
                meetingRef.update({
                    ClosedAt: tmpClosedAt
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