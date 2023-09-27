var mysql = require("mysql");

var con = mysql.createConnection({
  host: "localhost",
  user: "user",
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

  const createQuestionsTableSQL = `
    CREATE TABLE IF NOT EXISTS questions (
      questionNumber INT AUTO_INCREMENT PRIMARY KEY,
      question VARCHAR(255) NOT NULL,
      numberOfAnswers INT
      )
    `;

  const createAnswersTableSQL = `
    CREATE TABLE IF NOT EXISTS answers (
      questionNumber INT,
      answer VARCHAR(255),
      )
    `;

  const insertDataSQL = `
    INSERT INTO mydb.questions (questionNumber, question, numberOfAnswers) VALUES
      (1, 'Is there drought in September?', 2),
      (2, 'How many COVID hospitalizations in CA in Oct 2021?', 4),
    `;

  con.query(createDatabaseSQL, (err) => {
    if (err) {
      console.error("Error creating database:", err);
    } else {
      console.log("Database created successfully");

      // Create the table
      con.query(createQuestionsTableSQL, (err) => {
        if (err) {
          console.error("Error creating table:", err);
        } else {
          console.log("Table created successfully");

          // Insert data into the table
          con.query(insertDataSQL, (err) => {
            if (err) {
              console.error("Error inserting data:", err);
            } else {
              console.log("Data inserted successfully");
            }

            // Close the MySQL connection when done
            con.end((err) => {
              if (err) {
                console.error("Error closing connection:", err);
              } else {
                console.log("Connection closed");
              }
            });
          });
        }
      });
    }
  });
});
