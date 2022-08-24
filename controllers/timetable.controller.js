function dateRange(startDate, endDate, steps = 1) {
    const dateArray = [];
    let currentDate = new Date(startDate);

    while (currentDate <= new Date(endDate)) {
        dateArray.push(new Date(currentDate));
        // Use UTC date to prevent problems with time zones and DST
        currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }

    return dateArray;
}

async function getTimeTable(req, res) {
    var { startDate, endDate } = req.body;
    const dates = dateRange(startDate, endDate);
    const snapshot = await db.collection('newTimeTable')
        .where("date", "in", dates).get();
    console.log(dates);
    if (!snapshot.exists) {
        res
            .status(404)
            .json({ error: { code: 'wod-not found' } });
        return;
    }
    const wod = snapshot.data();

    res.status(200).json({ wod: wod });
}

module.exports = {
    getTimeTable
};