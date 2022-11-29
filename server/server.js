const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const multer = require("multer");
const uidSafe = require("uid-safe");
require("dotenv").config();

const { s3upload, s3delete } = require("../s3");

const { PORT = 3001, AWS_BUCKET, SESSION_SECRET } = process.env;

const cookieSession = require("cookie-session");

const { createUser, login, getUserById, updateAvatar } = require ("../db")
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


app.get("/api/user/me", async (req, res)=>{
     if(!req.session.user_id){
        res.json(null)
        return
    } 
    const loggedUser = await getUserById(req.session.user_id)
    const first_name = loggedUser.first_name
    const last_name = loggedUser.last_name

    res.json({first_name, last_name});
    //{ first_name: loggedUser.first_name , last_name: loggedUser.last_name }
})


app.post("/api/users", async (req, res)=>{
        console.log("req.body", req.body)
    try {

    const newUser = await createUser(req.body)
    req.session.user_id = newUser.id
    res.json({success: true})
    } catch (error) {
        console.log("POST users", error)
        res
        .status(500)
        .json({error: "Something is really wrong"})
    }

})

app.post("/api/login", async (req,res)=>{
    try {
    // console.log("req.body", req.body)
    const user = await login(req.body)
    if(!user){
        res
        .status(401)
        .json({error: "Email or Password are not correct"})
        return
    }
    req.session.user_id = user.id
    res.json({success: true})
    } catch (error) {
        console.log("POST login", error)
        res
        .status(500)
        .json({error: "Something is really wrong"})
    }

} )

app.post(
    "/api/upload",
    uploader.single("profile_picture_url"),
    s3upload,
    async (req, res) => {
        console.log(req.file.filename);
        console.log(req.session.user_id);
        const id = req.session.user_id
        const url = `https://s3.amazonaws.com/${AWS_BUCKET}/${req.file.filename}`;
        const image = await updateAvatar({ url, id });

        if (req.file) {
            res.json(image);
        } else {
            res.json({success: false});
        }
    }
);

/////// 
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
