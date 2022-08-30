const { firestoreAutoId } = require("../utils/idGenerator");


async function getTimeTable(req, res) {
    try {
        const { type, date } = req.body
        allTimeTable = []
        const timeTable = db.collection('newTimeTable').doc(date).collection(type);
        const snapshot = await timeTable.get();
        await snapshot.forEach(doc => {
            var customObj = {
                id: doc.id,
                capacity: doc.data().capacity,
                time: doc.data().time
            }
            allTimeTable.push(customObj);
        });

        if (allTimeTable.length == 0) {
            res
                .status(404)
                .send({ error: { code: 'timetable-not-found' } });
            return;
        }
        res.status(200).send({ data: allTimeTable });
    }
    catch (error) {
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

async function getCompleteTimeTable(req, res) {
    try {
        let completeData = [];
        const { date } = req.body
        const timeTable = db.collection('newTimeTable').doc(date);
        const collections = await timeTable.listCollections();
        for (collectio of collections) {
            // var categoryArray = []
            const categorySnap = db.collection('newTimeTable').doc(date).collection(collectio.id);
            await categorySnap.get().then((categoryData) => {
                categoryData.forEach(doc => {
                    var customObj = {
                        type: collectio.id,
                        id: doc.id,
                        capacity: doc.data().capacity,
                        time: doc.data().time
                    }
                    completeData.push(customObj);
                });
            })
        }
        console.log(completeData, "2");
        if (Object.keys(completeData).length == 0) {
            res
                .status(404)
                .send({ error: { code: 'no data found' } });
            return;
        }
        res.status(200).send({ data: completeData });
    }
    catch (error) {
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

    try {
        const { date, capacity, time, type } = req.body
        db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(firestoreAutoId())
            .set({ capacity: parseInt(capacity), time: time }, { merge: true })
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

async function editEvent(req, res) {

    try {
        const { date, capacity, time, id, type } = req.body
        db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(id)
            .set({ capacity: parseInt(capacity), time: time }, { merge: true })
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


async function deleteEvent(req, res) {

    try {
        const { date, id, type } = req.body
        db
            .collection('newTimeTable')
            .doc(date)
            .collection(type)
            .doc(id)
            .delete()
            .then((a) => {
                console.log(a);
                res.status(200).send({ message: "event deleted successfully" })
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
module.exports = {
    getTimeTable,
    setTimeTable,
    getCompleteTimeTable,
    deleteEvent
};