const express = require("express");
const mysql = require("mysql");
const path = require("path");
require("dotenv").config();

var app = express();
app.use(express.static(path.join(__dirname, "")));

const con = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");

  //Define an API endpoint to fetch questions
  app.get("/questions", (req, res) => {
    const sql = "SELECT * FROM questions";
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching questions:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        var fetchedData = JSON.parse(JSON.stringify(results));
        console.log(fetchedData);
        res.send(fetchedData);
      }
    });
  });

  app.get("/answers", (req, res) => {
    const sql = "SELECT * FROM answers";
    con.query(sql, (err, results) => {
      if (err) {
        console.error("Error fetching answers:", err);
        res.status(500).json({ error: "Internal server error" });
      } else {
        var fetchedData = JSON.parse(JSON.stringify(results));
        console.log(fetchedData);
        res.send(fetchedData);
      }
    });
  });

  const port = 3000;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
