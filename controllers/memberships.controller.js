const { firestoreAutoId } = require("../utils/idGenerator");
const {
    FieldValue
} = require('firebase-admin/firestore');
async function addMembership(req, res) {

    try {
        const { categoryName, planName, price, entries } = req.body
        var obj = {}
        obj[firestoreAutoId()] = {
            price: parseInt(price),
            entries: parseFloat(entries),
            planName: planName
        }
        db
            .collection('newMemberships')
            .doc(categoryName)
            .set(obj, { merge: true })
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
async function deleteMembershipCat(req, res) {

    try {
        const { categoryName, id } = req.body
        console.log(
            categoryName,
            id
        )
        const memberShipRef = db.collection('newMemberships').doc(categoryName);
        let removeCurrentUserId = memberShipRef.update({
            [id]: FieldValue.delete()
        }).then((a) => {
            console.log(a);
            res.status(200).send({ message: "membership deleted successfully" })
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
async function deleteMembership(req, res) {

    try {
        const { categoryName } = req.body
        console.log(
            categoryName,
            id
        )
        const memberShipRef = db.collection('newMemberships').doc(categoryName);
        let removeCurrentUserId = memberShipRef.delete().then((a) => {
            console.log(a);
            res.status(200).send({ message: "membership category deleted successfully" })
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
async function editMembership(req, res) {

    try {
        const { categoryName, id, planName, price, entries } = req.body
        var obj = {}
        obj[id] = {
            price: parseInt(price),
            entries: parseFloat(entries),
            planName: planName
        }
        const memberShipRef = db.collection('newMemberships').doc(categoryName);
        let removeCurrentUserId = memberShipRef.update(obj).then((a) => {
            console.log(a);
            res.status(200).send({ message: "membership edited successfully" })
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
async function getMemberships(req, res) {
    try {
        plans = []
        const membershipsRef = db.collection('newMemberships');
        const docs = await membershipsRef.get();

        await docs.forEach(doc => {
            planobj = doc.data()
            planobj["category"] = doc.id
            plans.push(planobj)
        });
        if (plans.length == 0) {
            res
                .status(404)
                .send({ error: { code: 'memberships-not-found' } });
            return;
        }
        res.status(200).send({ data: plans });

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


module.exports = {
    addMembership,
    deleteMembership,
    getMemberships,
    editMembership,
    deleteMembershipCat

};