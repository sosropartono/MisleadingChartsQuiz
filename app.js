var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
});

con.connect(function (err) {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL server");

  // Attempt to create the "mydb" database
  con.query("CREATE DATABASE IF NOT EXISTS mydb", function (err, result) {
    if (err) {
      console.error("Error creating database:", err);
      // Handle the error as needed
    } else {
      console.log("Database created successfully");
    }

    // Close the MySQL connection when done
    con.end(function (err) {
      if (err) {
        console.error("Error closing connection:", err);
      } else {
        console.log("Connection closed");
      }
    });
  });
});
