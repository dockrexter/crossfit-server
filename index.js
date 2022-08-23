const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require('cors')
const http = require('http');
require('dotenv').config()
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/api/users.router");
var wodRouter = require("./routes/api/wod.router");
const admin = require("firebase-admin");
const serviceAccount = require("./config/crossfit-bolzano-firebase-adminsdk-m3owr-172ce0ee89.json");
const firebaseConfig = require('./config/firebase.json');
const firebase = require('firebase/app');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://crossfit-bolzano-default-rtdb.europe-west1.firebasedatabase.app"
});
global.db = admin.firestore();
firebase.initializeApp(firebaseConfig);

const app = express();
app.use(cors())

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));




app.use("/", indexRouter);

app.use("/api/users", usersRouter);
app.use("/api/wod", wodRouter);

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || '4000';
app.set('port', port);

/**
 * Create HTTP server.
 */

/**
 * Listen on provided port, on all network interfaces.
 */
const server = http.createServer(app);


/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port, () => {
    console.log("backend running at port", port)
});



