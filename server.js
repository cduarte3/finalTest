/*************************************************************************
* BTI325 – Final Test
* I declare that this assignment is my own work in accordance with Seneca Academic 
* Policy. No part of this assignment has been copied manually or electronically from any 
* other source 
* (including 3rd party web sites) or distributed to other students.
* 
* Name: Christian Duarte Student ID: 158217208 Date: December 6th 2022
*
* Your app’s URL (from Cyclic) : https://wild-python.cyclic.app/
*
*************************************************************************/
var express = require("express"); // Include express.js module
var final = require("./final.js"); // include data - service module
var app = express();
var HTTP_PORT = process.env.PORT || 8080;

app.use(function(req, res, next) {
    res.locals.session = req.session;
    next();
});

var path = require("path");

function ensureLogin(req, res, next)
{
    if (!req.userSession.user1) {
        res.redirect("/login");
    } else { next();}
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

function onHttpStart() {
    console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, 'finalViews/', 'home.html'));
});

app.get("/register", function (req, res) {
    res.sendFile(path.join(__dirname, 'finalViews/', 'register.html'));
});

app.get("/signIn", function (req, res) {
    res.sendFile(path.join(__dirname, 'finalViews/', 'signIn.html'));
});

app.post("/register", (req, res) =>{
    final.register(req.body)
    .then(res.send(req.body.email + "registered successfully.<p><a href='/'>Go Home</a></p>"))
    .catch(err => { res.send(err) });
});

app.post("/signIn", (req, res) =>{
    final.signIn(req.body)
    .then(() => {
        res.send(req.body.email + "signed in successfully.<p><a href='/'>Go Home</a></p>");
    })
    .catch((err) => {
        res.send(err);
    });
});

app.get("*", (req, res) => {
    res.send("Page Not Found");
});

final.startDB()
    .then(() => { app.listen(HTTP_PORT, onHttpStart) })
    .catch((error) => { console.log(error) });

app.use((req, res) => {
    res.send("Page Not Found");
});
