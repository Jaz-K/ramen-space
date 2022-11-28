const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const { PORT = 3001 } = process.env;
const cookieSession = require("cookie-session");

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

// make a post request to server
app.get("/api/register", (req, res)=>{
    console.log("GET register works")
    res.json()
})

app.post("/api/register", (req, res)=>{
    console.log("POST register works")
    res.json({success: true})
})

// 
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`);
});
