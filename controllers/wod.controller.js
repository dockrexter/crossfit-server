async function getWod(req, res) {
    var date = req.body.date;
    const snapshot = await db.collection('WOD')
        .doc(date)
        .get();

    if (!snapshot.exists) {
        res
            .status(404)
            .json({ error: { code: 'wod-not found' } });
        return;
    }
    const wod = snapshot.data();

    res.status(200).json({ wod: wod });
}
async function setWod(req, res) {
    var {
        date,
        PartA,
        PartB,
        TypeA,
        TypeB
    } = req.body;

    const response = await db.collection('WOD')
        .doc(date)
        .set({
            date: date,
            PartA: PartA,
            PartB: PartB,
            TypeA, TypeA,
            TypeB, TypeB
        }, { merge: true });

    if (!response) {
        res
            .status(404)
            .json({ error: { code: 'could not add wod' } });
        return;
    }

    res.status(200).json({
        date: date,
        PartA: PartA,
        PartB: PartB,
        TypeA, TypeA,
        TypeB, TypeB
    });
}
module.exports = {
    getWod,
    setWod
};
