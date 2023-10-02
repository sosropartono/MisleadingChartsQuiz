var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "pw",
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");

  const createDatabaseSQL =
    "CREATE DATABASE IF NOT EXISTS mydb CHARACTER SET utf8 COLLATE utf8_general_ci";

  con.query(createDatabaseSQL, (err) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created successfully");
    }
  });

  con.end((error) => {
    if (error) {
      console.error("Error closing MySQL connection:", error);
      return;
    }
    console.log("MySQL connection closed.");
  });
});
