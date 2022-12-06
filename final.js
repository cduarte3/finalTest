var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

var loginSchema = new Schema({
    "email": {
        "type": String,
        "unique": true
    },
    "password": String,
});

let finalUsers;

module.exports.startDB = function () {
    return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection("mongodb+srv://christian-duarte7:Cd1136456@senecaweb.pbcgl7p.mongodb.net/final");
        db.on('error', (err) => {
            console.log("Cannot connect to DB.");
            reject(err);
        });
        db.once('open', () => {
            finalUsers = db.model("users", loginSchema);
            console.log("DB connection successful.");
            resolve();
        });
    });
}

module.exports.register = function (user) {
    return new Promise(function (resolve, reject) {
        if (user.email === "" || user.password === "") {
            reject("Error: email or password cannot be empty.")
        }
        else {
            const saltRounds = 10;
            bcrypt.genSalt(saltRounds, function (err, salts) {
                bcrypt.hash(user.password, salts, function (err, hash) {
                    userData.password = hash;
                    let newUser = new finalUsers(user);
                    newUser.save((err) => {
                        if (err) {
                            if (err.code == 11000) {
                                reject("Error: (" + user.email + ") already exists.");
                            }
                            reject("Error: cannot create the user.");
                        }
                        else {
                            console.log("user created");
                            resolve(user);
                        }
                    })
                })

            })
        }
    });
}

module.exports.signIn = function (user) {
    return new Promise(function (resolve, reject) {
        finalUsers.findOne({ email: user.email })
            .exec().then((U) => {
                if (!U) {
                    reject('Cannot find the user:' + user.email);
                } else {
                    bcrypt.compare(user.password, U.password).then((valid) => {
                        if (valid === true) {
                            resolve(U);
                        } else {
                            reject('Incorrect password for user ' + user.email);
                        }
                    })
                }
            }).catch(() => {
                reject('Unable to find user: ' + userData.userName);
            })
    });
}