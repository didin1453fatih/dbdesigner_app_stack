var uuid = require("uuid/v4");
var express = require("express");
var session = require("express-session");
var FileStore = require("session-file-store")(session);
var bodyParser = require("body-parser");
module.exports = {
  /**
   * event :{
   *  app : app,
   *  Mukmin : Mukmin,
   *  arg : arg
   * }
   */
  onEvent: async event => {
    console.log("ON WE B BEFORE LOAD lll" + JSON.stringify(event.app));
    var app = event.app;
    await app.use(bodyParser.urlencoded({ extended: false }));
    console.log("ON yyy");
    await app.use(bodyParser.json());
    await app.use(
      session({
        genid: req => {
          return uuid(); // use UUIDs for session IDs
        },
        store: new FileStore({
          path: "./storage/session/"
        }),
        secret: "keyboard cat",
        resave: true,
        saveUninitialized: true
      })
    );
    console.log("Assets static");
    console.log(await Mukmin.getPath("assets"));
    app.use("/static", express.static(await Mukmin.getPath("assets")));
    // app.use("/static", express.static(path.join(__dirname, "../../assets")));
    app.set("views", "./app/views");
    app.set("view engine", "ejs");
    app.set("trust proxy", 1); // trust first proxy
  }
};
