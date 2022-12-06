require("dotenv").config();
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const { s3upload } = require("../s3");

const { PORT = 3001, AWS_BUCKET, SESSION_SECRET } = process.env;

const cookieSession = require("cookie-session");

const {
    createUser,
    login,
    getUserById,
    updateAvatar,
    updateBio,
    searchUsers,
    lastThreeUsers,
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
} = require("../db");
//middleware

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
); // cookiesession

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get("/api/user/me", async (req, res) => {
    if (!req.session.user_id) {
        res.json(null);
        return;
    }
    const loggedUser = await getUserById(req.session.user_id);

    const { first_name, last_name, img_url, bio } = loggedUser;
    // const first_name = loggedUser.first_name;
    // const last_name = loggedUser.last_name;
    // const img_url = loggedUser.img_url;
    // const bio = loggedUser.bio;

    res.json({ first_name, last_name, img_url, bio });
});

app.post("/api/users", async (req, res) => {
    console.log("req.body", req.body);
    try {
        const newUser = await createUser(req.body);
        req.session.user_id = newUser.id;
        res.json({ success: true });
    } catch (error) {
        console.log("POST /users", error);
        res.status(500).json({ error: "Something is really wrong" });
    }
});

app.post("/api/login", async (req, res) => {
    try {
        const user = await login(req.body);
        if (!user) {
            res.status(401).json({
                error: "Email or Password are not correct",
            });
            return;
        }
        req.session.user_id = user.id;
        res.json({ success: true });
    } catch (error) {
        console.log("POST login", error);
        res.status(500).json({ error: "Something went really wrong" });
    }
});

app.post(
    "/api/users/profile_picture",
    uploader.single("avatar"),
    s3upload,
    async (req, res) => {
        console.log("req.file", req.file);
        console.log("session", req.session);
        const id = req.session.user_id;
        const img = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
        const avatar = await updateAvatar({ img, id });

        console.log("avatar", avatar);

        if (req.file) {
            res.json(avatar);
        } else {
            res.json({ success: false });
        }
    }
);

app.post("/api/users/bio", async (req, res) => {
    try {
        const id = req.session.user_id;
        const bio = req.body.bio;
        const newBio = await updateBio({ bio, id });
        res.json(newBio);
    } catch (error) {
        // res.json(error); // need testing it
        console.log("Something went wrong", error);
    }
});

app.get("/api/users-search", async (req, res) => {
    const { q } = req.query;
    try {
        if (!q) {
            const threeUsers = await lastThreeUsers();
            res.json(threeUsers);
            return;
        }
        const users = await searchUsers(q);
        res.json(users);
    } catch (error) {
        console.log("ERROR api/users-search", error);
        res.json({ success: false });
    }
});
// OTHERT USERS

app.get("/api/users/:otherUserId", async (req, res) => {
    const { otherUserId } = req.params;
    const { user_id } = req.session;
    const otherUser = await getUserById(otherUserId);
    // console.log("/api/users/:otherUserId", otherUserId);
    if (otherUserId == user_id || !otherUser) {
        res.json(null);
        return;
    } else {
        res.json(otherUser);
    }
});

// FRIENDREQUEST

function getFriendshipStatus(response, user_id) {
    if (!response) {
        return "NO_FRIENDSHIP";
    }
    if (!response.accepted && response.sender_id === user_id) {
        return "OUTGOING_FRIENDSHIP";
    }
    if (!response.accepted && response.recipient_id === user_id) {
        return "INCOMING_FRIENDSHIP";
    }
    if (response.accepted) {
        return "ACCEPTED_FRIENDSHIP";
    }
}

app.get("/api/friendships/:user_id", async (req, res) => {
    const otherUserId = req.params.user_id;
    const loggedUser = req.session.user_id;

    const response = await getFriendship(loggedUser, otherUserId);
    const status = await getFriendshipStatus(response, loggedUser);

    res.json(status);
});

//FRIEND POST REQUEST

app.post("/api/friendships/:user_id", async (req, res) => {
    const otherUserId = req.params.user_id;
    const loggedUser = req.session.user_id;

    const response = await getFriendship(loggedUser, otherUserId);
    const status = getFriendshipStatus(response, loggedUser);
    console.log("POST response ", status);

    let newStatus;

    if (status === "NO_FRIENDSHIP") {
        await requestFriendship({
            sender_id: loggedUser,
            recipient_id: otherUserId,
        });
        newStatus = "OUTGOING_FRIENDSHIP";
    }

    if (status === "INCOMING_FRIENDSHIP") {
        await acceptFriendship({
            sender_id: loggedUser,
            recipient_id: otherUserId,
        });
        newStatus = "ACCEPTED_FRIENDSHIP";
    }

    if (status === "ACCEPTED_FRIENDSHIP") {
        await deleteFriendship({
            sender_id: otherUserId,
            recipient_id: loggedUser,
        });
        newStatus = "NO_FRIENDSHIP";
    }
    res.json(newStatus);
});

app.post("/api/rejectfriendships/:user_id", async (req, res) => {
    const otherUserId = req.params.user_id;
    const loggedUser = req.session.user_id;

    const response = await getFriendship(loggedUser, otherUserId);
    const status = getFriendshipStatus(response, loggedUser);
    console.log("POST response ", status);

    await deleteFriendship({
        sender_id: otherUserId,
        recipient_id: loggedUser,
    });
    let newStatus = "NO_FRIENDSHIP";
    res.json(newStatus);
});

// LOGOUT

app.get("/logout", (req, res) => {
    (req.session = null), res.redirect("/");
});

///////
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
