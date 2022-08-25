function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate).toDateString());
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
}

async function getTimeTable(req, res) {

    var { startDate, endDate } = req.body;
    const dates = dateRange(startDate, endDate);
    var docs = []
    const queey = await db.collection('newTimeTable').get();
    docs = queey.docs.map((doc) => {

        if (dates.indexOf(doc.data().date.toDate().toDateString()) !== -1) {

            var obj = doc.data();

            obj["date"] = doc.data().date.toDate().toDateString();

            return obj;
        }

    });

    if (docs.length == 0) {
        res
            .status(404)
            .json({ error: { code: 'no classes found' } });
        return;
    }
    res.status(200).json({ docs: docs });
}

module.exports = {
    getTimeTable
};