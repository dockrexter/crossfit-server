const { firestoreAutoId } = require("../utils/idGenerator");

async function addMembership(req, res) {

    try {
        const { categoryName, planName, price, entries } = req.body
        db
            .collection('newMemberships')
            .doc(categoryName)
            .collection("plans")
            .doc(firestoreAutoId())
            .set({ price: parseInt(price), entries: parseFloat(entries), planName: planName }, { merge: true })
            .then((a) => {
                console.log(a);
                res.status(200).send({ message: "membership added successfully" })
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
    addMembership
};