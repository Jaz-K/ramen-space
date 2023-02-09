require("dotenv").config();
const express = require("express");
const app = express();
// ------- socket
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

// ------- socket
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");

const { s3upload, s3delete } = require("../s3");

const { PORT = 3001, AWS_BUCKET, SESSION_SECRET } = process.env;

const cookieSession = require("cookie-session");

const {
    createUser,
    login,
    getUserById,
    updateAvatar,
    updateBio,
    searchUsers,
    lastNewUsers,
    getFriendship,
    requestFriendship,
    acceptFriendship,
    deleteFriendship,
    getFriendships,
    getChatMessages,
    setChatMessages,
    getWallMessages,
    setWallMessages,
    // getUsersByArray,
    deleteUser,
    // deleteFriendships,
    // deleteChatMessages,
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

// --- SOCKET IO COOKIE SESSION
const cookieSessionMiddleware = cookieSession({
    secret: SESSION_SECRET,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    sameSite: true,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
// ----------------------

/* app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
); // cookiesession
 */
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

    const { id, first_name, last_name, img_url, bio } = loggedUser;

    res.json({ id, first_name, last_name, img_url, bio });
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
        const id = req.session.user_id;
        const userImg = await getUserById(id);
        const { img_url } = userImg;

        if (!img_url) {
            const img = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
            const avatar = await updateAvatar({ img, id });
            if (req.file) {
                res.json(avatar);
            } else {
                res.json({ success: false });
            }
            return;
        } else {
            await s3delete(img_url.slice(36));
            const img = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
            const avatar = await updateAvatar({ img, id });
            if (req.file) {
                res.json(avatar);
            } else {
                res.json({ success: false });
            }
            return;
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
            const threeUsers = await lastNewUsers();
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

app.get("/api/friendshipstatus/:user_id", async (req, res) => {
    const otherUserId = req.params.user_id;
    const loggedUser = req.session.user_id;

    const response = await getFriendship(loggedUser, otherUserId);
    const status = await getFriendshipStatus(response, loggedUser);

    res.json(status);
});

//FRIEND POST REQUEST

app.post("/api/friendshipstatus/:user_id", async (req, res) => {
    const otherUserId = req.params.user_id;
    const loggedUser = req.session.user_id;

    const response = await getFriendship(loggedUser, otherUserId);
    const status = getFriendshipStatus(response, loggedUser);

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
            sender_id: otherUserId,
            recipient_id: loggedUser,
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

// GET FRIENDSHIPS ME

app.get("/api/friendships", async (req, res) => {
    const loggedUser = req.session.user_id;
    const friendships = await getFriendships(loggedUser);
    res.json(
        friendships.map((friendship) => ({
            ...friendship,
            status: getFriendshipStatus(friendship, loggedUser),
        }))
    );
    // req.json({ success: true });
});

// GET FRIENDSHIPS OTHER

app.get("/api/friendships/:user_id", async (req, res) => {
    const otherUser = req.params.user_id;
    const friendships = await getFriendships(otherUser);

    res.json(
        friendships.map((friendship) => ({
            ...friendship,
            status: getFriendshipStatus(friendship, otherUser),
        }))
    );
    // req.json({ success: true });
});

// GET WALLMESSAGES

app.get("/api/wallmessages/:user_id", async (req, res) => {
    const { user_id } = req.params;
    const wallMessage = await getWallMessages(user_id);

    res.json(wallMessage);
});

// POST WALLMASSEGES

app.post("/api/wallmessages/:user_id", async (req, res) => {
    const recipient_id = req.params.user_id;
    const sender_id = req.session.user_id;
    const directmessage = req.body.directmessage;

    const newWallMessage = await setWallMessages({
        sender_id,
        recipient_id,
        directmessage,
    });
    const { first_name, last_name, img_url } = await getUserById(sender_id);
    const newChatObj = {
        ...newWallMessage,
        first_name,
        last_name,
        img_url,
        directmessage,
    };
    res.json(newChatObj);
});
// DELETE PROFILE

app.post("/api/remove-profile", async (req, res) => {
    const user_id = req.session.user_id;
    const userImg = await getUserById(user_id);
    const { img_url } = userImg;
    if (img_url) {
        await s3delete(img_url.slice(36));
    }
    const response = await deleteUser(user_id);
    // await deleteFriendships(user_id);
    // await deleteChatMessages(user_id);

    req.session = null;
    res.json(response);
    // res.redirect("/");
});
// LOGOUT

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

///////
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});

// ----- SOCKET IO
const loggedUsers = {};
io.on("connection", async (socket) => {
    console.log("[social:socket] incoming socked connection", socket.id);
    console.log("session", socket.request.session);
    const { user_id } = socket.request.session;
    if (!user_id) {
        return socket.disconnect(true);
    }
    ///// ONLINE USERS IN SOCKET
    loggedUsers[socket.id] = user_id;
    console.log("loggedUser", loggedUsers);

    ///// ONLINE USER CHAT
    const onlineUserIds = Object.values(loggedUsers);
    console.log(onlineUserIds);
    //remove multi logged users
    const clearedUserIds = [...new Set(onlineUserIds)];
    console.log(clearedUserIds);
    // const onlineUserDetails = await getUsersByArray(clearedUserIds);
    // console.log("ONLINE USERS", onlineUserDetails);
    // io.emit("onlineUser", onlineUserDetails);

    ///// CHAT
    socket.on("openChat", async function () {
        console.log("Someone entered the chat");
        const chatMessages = await getChatMessages();
        socket.emit("chat", chatMessages);
    });
    const chatMessages = await getChatMessages();
    io.emit("chat", chatMessages);

    socket.on("newMessage", async function ({ message }) {
        const sender_id = user_id;
        const session_id = socket.request.session.user_id;
        const chatData = await setChatMessages({ sender_id, message });
        const { first_name, last_name, img_url } = await getUserById(sender_id);
        const newChatObj = {
            ...chatData,
            first_name,
            last_name,
            img_url,
            sender_id,
            message,
            session_id,
        };
        io.emit("newMessage", newChatObj);
    });
    /////  FRIENDREQUEST
    socket.on("newFriendRequest", function (data) {
        const receiverFriendRequest = Object.keys(loggedUsers).find(
            (key) => loggedUsers[key] == data
        );
        io.to(receiverFriendRequest).emit("newFriendRequest", "new request");
    });
    ///// DISCONNECT
    console.log("user_id in socket", user_id);

    // keep track of disconnecting users
    socket.on("disconnect", () => {
        console.log("see you next time", user_id);
        delete loggedUsers[socket.id];
    });
});
