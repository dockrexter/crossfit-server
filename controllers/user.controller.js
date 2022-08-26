const {
    getAuth: getAdminAuth,
} = require('firebase-admin/auth');

const {
    getAuth: getClientAuth,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
} = require('firebase/auth');


async function register(req, res) {
    const { email, password, role } = req.body;
    if (!role) {
        res
            .status(400)
            .json({ error: { code: 'no-role' } });
        return;
    }

    try {
        const auth = getClientAuth();
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const adminAuth = getAdminAuth();
        await getAdminAuth().setCustomUserClaims(credential.user.uid, { role })
        const token = await adminAuth.createCustomToken(
            credential.user.uid
        );
        if (role == "user") {
            await db
                .collection('USERS').doc(credential.user.uid).set({
                    Picture: "",
                    CodiceFiscale: "",
                    Contact: "",
                    Email: credential.user.email,
                    FirstName: "",
                    LastName: "",
                    Status: true,
                    social: false,
                    uid: credential.user.uid,
                    Plan: {
                        Entries: 0,
                        Price: 0,
                        TotalEntries: 0,
                        Type: "",
                        ValidFrom: "",
                        ValidThru: "",
                    },
                    ValidFrom: "",
                    ValidThru: "",
                });
        }
        res.status(201).json({ token });
    } catch (err) {
        console.log(err);
        const { code } = err;
        if (code === 'auth/email-already-in-use') {
            res.status(400);
        } else {
            res.status(500);
        }
        res.json({
            error: {
                code: code ? code.replace('auth/', '') : undefined,
            },
        });
    }
}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        const credential = await signInWithEmailAndPassword(
            getClientAuth(),
            email,
            password
        );
        console.log(credential);
        const token = await getAdminAuth().createCustomToken(
            credential.user.uid,
        );

        res.status(200).json({ token });
    } catch (error) {
        if (
            error.code === 'auth/wrong-password' ||
            error.code === 'auth/user-not-found'
        ) {
            res.status(403);
        } else {
            res.status(500);
        }
        res.json({
            error: { code: error.code.replace('auth/', '') },
        });
    }
}


async function deleteUser(req, res) {
    const { uid } = req.body;
    getAdminAuth()
        .deleteUser(uid)
        .then(() => {
            console.log('Successfully deleted user');
            try {
                db
                    .collection('USERS')
                    .doc(uid).set({ Status: false }, { merge: true }).then(() => {
                        res.status(200).send({ message: "user status updated successfully" })
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
                res
                    .status(500)
                    .json({
                        error: {
                            code: error,
                            message: 'internal server error'
                        }
                    });
            }
            res.status(200).json({ message: 'Successfully deleted user' });
        })
        .catch((error) => {
            res.status(403);
            res.json({
                error: { code: error }
            });
        });
}

async function updateUser(req, res) {
    const { object, uid } = req.body
    console.log(object, uid);
    try {
        db
            .collection('USERS')
            .doc(uid).set(object, { merge: true }).then(() => {
                res.status(200).send({ message: "user updated successfully" })
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

async function getUser(req, res) {
    const userId = req.body.id;
    console.log(req);
    if (!userId) {
        res.status(400).json({ error: { code: 'no-user-id' } });
        return;
    }

    const snapshot = await db
        .collection('USERS')
        .doc(userId)
        .get();
    if (!snapshot.exists) {
        res
            .status(404)
            .json({ error: { code: 'user-not-found' } });
        return;
    }
    const user = snapshot.data();

    res.status(200).json({ user: user });
}

async function getAllUsers(req, res) {
    allUsers = []
    console.log(req.token, "<- I am in the function")
    const users = db.collection('USERS');
    const snapshot = await users.get();
    snapshot.forEach(doc => {
        allUsers.push(doc.data());
    });

    if (allUsers.length == 0) {
        res
            .status(404)
            .send({ error: { code: 'user-not-found' } });
        return;
    }
    res.status(200).send({ data: allUsers });
}

module.exports = {
    register,
    login,
    getUser,
    getAllUsers,
    deleteUser,
    updateUser,
};

