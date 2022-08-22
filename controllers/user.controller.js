
const {
    getAuth: getAdminAuth,
} = require('firebase-admin/auth');
const {
    getAuth,
    createUserWithEmailAndPassword,
} = require('firebase/auth');

const firestore = require('firebase-admin').firestore();


async function register(req, res) {
    const { email, password, secureNote } = req.body;
    if (!secureNote) {
        res
            .status(400)
            .json({ error: { code: 'no-secure-note' } });
        return;
    }

    try {
        const auth = getAuth();
        const credential = await createUserWithEmailAndPassword(
            auth,
            email,
            password
        );
        const adminAuth = getAdminAuth();
        const token = await adminAuth.createCustomToken(
            credential.user.uid
        );
        await firestore
            .doc(`users/${credential.user.uid}`)
            .set({ secureNote });
        res.status(201).json({ token });
    } catch (err) {
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
        const token = await getAdminAuth().createCustomToken(
            credential.user.uid
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

async function getUser(req, res) {
    const userId = req.params.id;
    if (!userId) {
        res.status(400).json({ error: { code: 'no-user-id' } });
        return;
    }

    if (userId !== req.token.uid) {
        res
            .status(403)
            .json({ error: { code: 'unauthorized' } });
    }

    const snapshot = await firestore
        .collection('users')
        .doc(userId)
        .get();
    if (!snapshot.exists) {
        res
            .status(404)
            .json({ error: { code: 'user-not-found' } });
        return;
    }
    const user = snapshot.data();

    res.status(200).json({ secureNote: user.secureNote });
}

module.exports = {
    register,
    login,
    getUser
};

