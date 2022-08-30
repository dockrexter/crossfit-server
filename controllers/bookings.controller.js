async function getBookings(req, res) {

    try {
        var users = []
        var waitingList = []
        const { date, id, type } = req.body
        console.log(
            date,
            id,
            type
        )
        const usersRef = db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(id)
            .collection("Users");

        const WaitingListRef = db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(id)
            .collection("WaitingList");

        const usersSnapshot = await usersRef.get();
        const waitingListSnapshot = await WaitingListRef.get();

        await usersSnapshot.forEach(doc => {
            users.push(doc.data());
        });
        await waitingListSnapshot.forEach(doc => {
            waitingList.push(doc.data());
        });

        if (users.length == 0 && waitingList.length) {
            res
                .status(400)
                .send({ error: { code: 'bookings-not-found' } });
            return;
        }
        res.status(200).send({ users: users, waitingList: waitingList });


    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                error: {
                    code: error,
                    message: 'internal server error'
                }
            });
    }
}
async function addUser(req, res) {
    try {
        var message = {};

        const {
            date,
            id,
            type,
            FirstName,
            LastName,
            Picture,
            uid,
        } = req.body

        const resp = await db.runTransaction(async t => {
            const capacity = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)

            const currentUsers = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("Users")

            const usersRef = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("Users")
                .doc(uid);

            const WaitingListRef = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("WaitingList")
                .doc(uid);

            const usersSnapshot = await t.get(usersRef);
            const waitingListSnapshot = await t.get(WaitingListRef);
            const capacitySnapshot = await t.get(capacity);
            const currentUsersSnapshot = await t.get(currentUsers);
            console.log(capacitySnapshot.data().capacity, currentUsersSnapshot.size);

            // if (typeof usersSnapshot.data() == "undefined") {
            //     t.set(usersRef, {
            //         FirstName: FirstName,
            //         LastName: LastName,
            //         Picture: Picture,
            //         uid: uid
            //     })
            //     message["code"] = "0";
            //     message["added_to"] = "users list";
            // }
            if (capacitySnapshot.data().capacity > currentUsersSnapshot.size && typeof usersSnapshot.data() == "undefined") {
                t.set(usersRef, {
                    FirstName: FirstName,
                    LastName: LastName,
                    Picture: Picture,
                    uid: uid
                })
                message["code"] = "0";
                message["added_to"] = "users list";
            }
            else if (capacitySnapshot.data().capacity <= currentUsersSnapshot.size && typeof usersSnapshot.data() == "undefined" && typeof waitingListSnapshot.data() == "undefined") {
                t.set(WaitingListRef, {
                    FirstName: FirstName,
                    LastName: LastName,
                    Picture: Picture,
                    uid: uid
                })
                message["code"] = "1";
                message["added_to"] = "waitning list";
            }
        });
        console.log('Transaction success', resp);
        if (typeof message["code"] == "undefined") {
            res
                .status(404)
                .send({ error: { code: 'user already booked' } });
            return;
        }
        res.status(200).send(message);

    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({
                error: {
                    code: error,
                    message: 'internal server error'
                }
            });
    }

}

module.exports = {
    getBookings,
    addUser
};