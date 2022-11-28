const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
require("dotenv").config();

const { PORT = 3001 } = process.env;
const {  SESSION_SECRET } = process.env;
const cookieSession = require("cookie-session");

const { createUser, login } = require ("../db")
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

app.get('/api/user/id.json', function (req, res) {
    if(!req.session.userId){
        res.json(null)
    } else {
    res.json({ userId: req.session.userId });
    }
}); 

/* app.get('/api/user/id.json', function (req, res) {
    console.log("req.session.userId",req.session.userId)
    res.json({ userId: req.session.userId });
}); */

app.post("/api/users", async (req, res)=>{
        console.log("req.body", req.body)
    try {

    // console.log("POST register works")
    const newUser = await createUser(req.body)
    req.session.userId = newUser.id
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
    req.session.userId = user.id
    res.json({success: true})
    } catch (error) {
        console.log("POST login", error)
        res
        .status(500)
        .json({error: "Something is really wrong"})
    }

} )

/////// 
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
