const { getAuth } = require('firebase-admin/auth');

async function firebaseAuth(req, res, next) {
    const regex = /Bearer (.+)/i;
    console.log(req.headers['authorization'], "check");
    try {
        const idToken = req.headers['authorization'].match(regex)?.[1];
        req.token = await getAuth().verifyIdToken(idToken);
        if (req.token.role == "admin") {
            next();
        }
        else {
            res
                .status(401)
                .send({ error: { code: 'unauthenticated' } });
        }
        // console.log(req.token, "apple");
        // next();
    } catch (err) {
        res
            .status(401)
            .send({ error: { code: 'unauthenticated' } });
    }
}

module.exports = firebaseAuth;