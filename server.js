const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const fs = require("fs");
const multer = require("multer");
const app = express();
const final = require("./final");

app.use(bodyParser.urlencoded({ extended: true }));

app.set("finalViews", path.join(__dirname, "finalViews"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "finalViews", "home.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "finalViews", "register.html"));
});

app.get("/signIn", (req, res) => {
  res.sendFile(path.join(__dirname, "finalViews", "signIn.html"));
});

app.post("/signIn", (req, res) => {
  final
    .signIn()
    .then((data) => {
      res.send(
        `User with email ${data.email} has signed in. <a href="/">Go Home</a>`
      );
    })
    .catch((err) => {
      res.send(`${err}`);
    });
});

app.post("/register", (req, res) => {
  const data = req.body;
  console.log(data);
  const final = require("./final");
  final
    .register(req.body)
    .then((data) => {
      res.send(
        `User with email ${data.email} has been registered. <a href="/">Go Home</a>`
      );
    })
    .catch((err) => {
      res.send(`Error: ${err}`);
    });
});

app.get("/signIn", (req, res) => {
  res.sendFile("signIn.html");
});

app.post("/signIn", (req, res) => {
  const data = req.body;
  console.log(data);
  final
    .signIn(data)
    .then((data) => {
      res.send(
        `User with email ${data.email} has signed in. <a href="/">Go Home</a>`
      );
    })
    .catch((err) => {
      res.send(`Error: ${err}`);
    });
});

app.all("*", (req, res) => {
  res.send("NotFound");
});

final
  .startDB()
  .then(() => {
    app.listen(3000, () => {
      console.log("Server listening port on 3000");
    });
  })
  .catch((err) => {
    console.log("Error starting DB: ", err);
  });
