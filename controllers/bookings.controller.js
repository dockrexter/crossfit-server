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
                .status(404)
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
module.exports = {
    getBookings,
};