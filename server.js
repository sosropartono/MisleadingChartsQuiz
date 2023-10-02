const express = require("express");
const mysql = require("mysql");

const app = express();

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "*DinosavR89!",
  database: "mydb",
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
