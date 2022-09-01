const { firestoreAutoId } = require("../utils/idGenerator");
const {
    FieldValue
} = require('firebase-admin/firestore');
async function getPr(req, res) {
    try {
        prs = []
        const membershipsRef = db.collection('PRList');
        const docs = await membershipsRef.get();

        await docs.forEach(doc => {
            var planobj = doc.data()
            planobj["id"] = doc.id
            prs.push(planobj)
        });
        if (prs.length == 0) {
            res
                .status(404)
                .send({ error: { code: 'prs-not-found' } });
            return;
        }
        res.status(200).send({ data: prs });

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
async function addPrCategory(req, res) {
    try {
        const { name } = req.body
        prs = []
        db
            .collection('PRList')
            .doc(firestoreAutoId())
            .set({
                title: name,
                data: []
            }).then(() => {
                res.status(200).send({ message: "PR Category added successfully" });
            })
            .catch((err) => {
                res.status(401).send({ message: err });
            })


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
async function addPr(req, res) {
    try {
        const { categoryId, name } = req.body
        prs = []
        db
            .collection('PRList')
            .doc(categoryId)
            .update({
                data: FieldValue.arrayUnion(name)
            }).then(() => {
                res.status(200).send({ message: "PR added successfully" });
            })
            .catch((err) => {
                res.status(401).send({ message: err });
            })


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
async function deletePr(req, res) {
    try {
        const { categoryId, name } = req.body
        prs = []
        db
            .collection('PRList')
            .doc(categoryId)
            .update({
                data: FieldValue.arrayRemove(name)
            }).then(() => {
                res.status(200).send({ message: "PR removed successfully" });
            })
            .catch((err) => {
                res.status(401).send({ message: err });
            })


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
async function editPr(req, res) {
    try {
        const { categoryId, name, newName } = req.body
        const prRef = db.collection('PRList').doc(categoryId)
        prRef.update({
            data: FieldValue.arrayRemove(name),
        }).then(() => {
            prRef.update({
                data: FieldValue.arrayUnion(newName)
            }).then(() => {
                res.status(200).send({ message: "PR edited successfully" });
            })
                .catch((err) => {
                    res.status(401).send({ message: err });
                })
        })
            .catch((err) => {
                res.status(401).send({ message: err });
            })


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
async function editPrCategory(req, res) {
    try {
        const { categoryId, title } = req.body
        const prRef = db.collection('PRList').doc(categoryId)
        prRef.update({
            title: title,
        }).then(() => {
            res.status(200).send({ message: "PR category edited successfully" });
        })
            .catch((err) => {
                res.status(401).send({ message: err });
            })


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

    getPr,
    addPrCategory,
    addPr,
    deletePr,
    editPr,
    editPrCategory
}