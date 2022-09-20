const moment = require('moment');
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
        const waitingListSnapshot = await WaitingListRef.orderBy('WaitingId').get();

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

            const WaitingCountRef = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("WaitingList")

            const userPlans = db
                .collection('userPlans')
                .doc(uid)

            const usersSnapshot = await t.get(usersRef);
            const waitingListSnapshot = await t.get(WaitingListRef);
            const capacitySnapshot = await t.get(capacity);
            const currentUsersSnapshot = await t.get(currentUsers);
            const WaitingCountSnapshot = await t.get(WaitingCountRef);
            const planDataUser = await t.get(userPlans);
            const planData =  planDataUser.data();
            if(planData?Object.keys(planData).length:false){
                var count = Object.keys(planData);
                count.forEach(doc=>{
                    if(moment(planDataUser.data()[doc]['validFrom']) < moment(new Date) && moment(planDataUser.data()[doc]['validThru']) > moment(new Date)){
                        const remaingEntries = planDataUser.data()[doc]['totalentries'] -  planDataUser.data()[doc]['entries'];
                        if(remaingEntries <= 0){
                            // message["code"] = "2";
                            // message["Falied"] = "User Entries Are Full";
                            throw "User Entries Are Full"
                        }
                    }
                })
            }else{
                res.status(401).json({
                    message: "User Don't have plans"
                })
                return;
            }
            console.log(capacitySnapshot.data().capacity, currentUsersSnapshot.size);

            if (capacitySnapshot.data().capacity > currentUsersSnapshot.size && typeof usersSnapshot.data() == "undefined") {
                await t.set(usersRef, {
                    FirstName: FirstName,
                    LastName: LastName,
                    Picture: Picture,
                    uid: uid
                })
                message["code"] = "0";
                message["added_to"] = "users list";
            }
            else if (capacitySnapshot.data().capacity <= currentUsersSnapshot.size && typeof usersSnapshot.data() == "undefined" && typeof waitingListSnapshot.data() == "undefined") {
                await t.set(WaitingListRef, {
                    WaitingId: WaitingCountSnapshot.size + 1,
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
    if(error == "User Entries Are Full"){
        res.json({
            error: {
                code: 404,
                message: 'User Entries Are Full'
            }
        }).status(405);
        return;
    }else{
        res
            .status(500)
            .json({
                error: {
                    code: error,
                    message: 'internal server error'
                }
            });
    }}

}

async function removeFromWaitingList(req, res) {

    try {
        const { date, id, type, uid } = req.body
        console.log(
            date,
            id,
            type
        )

        db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(id)
            .collection("WaitingList")
            .doc(uid)
            .delete()
            .then((a) => {
                console.log(a);
                res.status(200).send({ message: `user with uid : ${uid} removed from waiting list` })
            }).catch((error) => {
                res
                    .status(404)
                    .json({
                        error: {
                            code: error,
                            message: 'not found'
                        }
                    });
            })
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
async function removeUser(req, res) {

    try {
        var message = "user removed successfully";
        var users = [];
        const { date, id, type, uid } = req.body
        console.log(
            date,
            id,
            type
        )
        const resp = await db.runTransaction(async t => {

            const userRef = db
                .collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("Users")
                .doc(uid)

            const waitingUserRef = db.
                collection('newTimeTable')
                .doc(date)
                .collection(type)
                .doc(id)
                .collection("WaitingList").orderBy("WaitingId").limit(1);

            const first_waiting_user = await t.get(waitingUserRef);
            const delete_response = await t.delete(userRef);

            console.log(delete_response);

            await first_waiting_user.forEach(doc => {
                users.push(doc.data());
            });

            if (users.length !== 0) {
                console.log(users[0]);

                const add_waiting_user_to_user_list_ref = db
                    .collection('newTimeTable')
                    .doc(date)
                    .collection(type)
                    .doc(id)
                    .collection("Users")
                    .doc(users[0].uid)

                const delete_user_from_waiting_list = db
                    .collection('newTimeTable')
                    .doc(date)
                    .collection(type)
                    .doc(id)
                    .collection("WaitingList")
                    .doc(users[0].uid)

                await t.set(add_waiting_user_to_user_list_ref, users[0])
                await t.delete(delete_user_from_waiting_list);
                message = "user removed and 1 user from waiting is added to users list"
            }
        });
        console.log('Transaction success', resp);
        res
            .status(201)
            .send({ message: message });
        return;
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
    addUser,
    removeFromWaitingList,
    removeUser
};