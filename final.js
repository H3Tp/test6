const mongoose = require("mongoose"); // mangoose
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");
// new schema
const finalUserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

let User;
// it will start the DB-----------------------------------------------
module.exports.startDB = function () {
  return new Promise(function (resolve, reject) {
    let db = mongoose.createConnection(
      "mongodb+srv://admin:admin@cluster0.qsuyzn4.mongodb.net/?retryWrites=true&w=majority"
    );

    db.on("error", (err) => {
      console.log("Not connecting to DB", err);
      reject(err);
    });

    db.once("open", () => {
      console.log("DataBase Connection Successful");
      User = db.model("Finalusers", finalUserSchema);
      resolve();
    });
  });
};
// making functions
module.exports.register = function (userData) {
  return new Promise(function (resolve, reject) {
    if (userData.email == "" && userData.password == "") {
      reject("Please enter an email and password");
    } else {
      bcrypt
        .genSalt(10)
        .then((salt) => bcrypt.hash(userData.password, salt))
        .then((hash) => {
          userData.password = hash;
          let newUser = new User(userData);
          newUser.save((err) => {
            if (err) {
              if (err.code == 11000) {
                reject("The User Email already taken");
              } else {
                reject("There was error creating the user: " + err);
              }
            } else {
              resolve();
            }
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
};

// user data
module.exports.signIn = function (userData) {
  console.log(userData);
  return new Promise(function (resolve, reject) {
    User.find({ email: userData.email })
      .exec()
      .then((users) => {
        if (!users) {
          reject("Unable to find user: " + userData.email);
        } else {
          if (bcrypt.compareSync(userData.password, users[0].password)) {
            resolve(users[0]);
          } else {
            reject("Incorrect Password for user: " + userData.email);
          }
        }
      })
      .catch(() => {
        reject("Unable to find user: " + userData.email);
      });
  });
};
