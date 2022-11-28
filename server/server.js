const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001 } = process.env;
const cookieSession = require("cookie-session");

// const { createUser, login} = require ("../db")

//middleware
app.use(
    cookieSession({
        secret: "my secret text",
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

/* app.get('/api/user/id.json', function (req, res) {
    if(!req.session.userId){
        res.json(null)
    } else {
    res.json({
        userId: req.session.userId
    });
    }
}); */

app.get('/api/user/id.json', function (req, res) {
    res.json({ userId: req.session.userId });
});

app.post("/api/users", async (req, res)=>{
    console.log("req.body", req.body)
    // await createUser(req.body)
    console.log("POST register works")
    res.json({success: true})
})

app.post("/api/login", async (req,res)=>{
    console.log("req.body", req.body)
    // await login(req.body)
} )

/////// 
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
