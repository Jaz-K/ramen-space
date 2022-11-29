const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const {  SESSION_SECRET } = process.env;
const cookieSession = require("cookie-session");

const { createUser, login, getUserById } = require ("../db")
//middleware
app.use(
    cookieSession({
        secret: SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());


app.get("/api/user/me", async (req, res)=>{
     if(!req.session.user_id){
        res.json(null)
        return
    } 
    console.log("req.session.user_id",req.session.user_id)
    const loggedUser = await getUserById(req.session.user_id)
    console.log(loggedUser)
    res.json({ loggedUser });
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

app.post("/api/users/profile_picture", (req, res)=>{
    console.log("POST req")
})

/////// 
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
