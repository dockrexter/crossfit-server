// function dateRange(startDate, endDate, steps = 1) {
//     const dateArray = [];
//     let currentDate = new Date(startDate);

//     while (currentDate <= new Date(endDate)) {
//         dateArray.push(new Date(currentDate).toDateString());
//         // Use UTC date to prevent problems with time zones and DST
//         currentDate.setUTCDate(currentDate.getUTCDate() + steps);
//     }

//     return dateArray;
// }

// async function getTimeTable(req, res) {

//     var { startDate, endDate } = req.body;
//     const dates = dateRange(startDate, endDate);
//     var docs = []
//     const queey = await db.collection('newTimeTable').get();
//     docs = queey.docs.map((doc) => {

//         if (dates.indexOf(doc.data().date.toDate().toDateString()) !== -1) {

//             var obj = doc.data();

//             obj["date"] = doc.data().date.toDate().toDateString();

//             return obj;
//         }

//     });

//     if (docs.length == 0) {
//         res
//             .status(404)
//             .json({ error: { code: 'no classes found' } });
//         return;
//     }
//     res.status(200).json({ docs: docs });
// }


async function getTimeTable(req, res) {
    try {
        const { type, date } = req.body
        allTimeTable = []
        const timeTable = db.collection('newTimeTable').doc(date).collection(type);
        const snapshot = await timeTable.get();
        await snapshot.forEach(doc => {
            allTimeTable.push(doc.data());
        });

        if (allTimeTable.length == 0) {
            res
                .status(404)
                .send({ error: { code: 'timetable-not-found' } });
            return;
        }
        res.status(200).send({ data: allTimeTable });
    }
    catch {
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

async function setTimeTable(req, res) {
    const { date, capacity, time, type } = req.body
    try {
        db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(time)
            .set({ capacity: capacity, time: time }, { merge: true })
            .then((a) => {
                console.log(a);
                res.status(200).send({ message: "event added successfully" })
            }).catch((error) => {
                res
                    .status(404)
                    .json({
                        error: {
                            code: error,
                            message: 'something went wrong'
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

module.exports = {
    getTimeTable,
    setTimeTable
};