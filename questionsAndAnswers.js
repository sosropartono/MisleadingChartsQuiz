const mysql = require("mysql");
require("dotenv").config();

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

  const createQuestionsTableSQL = `
    CREATE TABLE IF NOT EXISTS questions (
      questionID INT AUTO_INCREMENT PRIMARY KEY,
      question VARCHAR(255) NOT NULL
    )
`;

  //1 for correct answer and 0 for wrong answer
  const createAnswersTableSQL = `
    CREATE TABLE IF NOT EXISTS answers (
      questionID INT,
      answer VARCHAR(255),
      correctOrNot INT    
    )
`;

  const insertDataIntoAnswersTable = `
      INSERT INTO answers (questionID, answer, correctOrNot) VALUES
          (1, 'yes', 1),
          (1, 'no', 0),
          (2, '200', 0),
          (2, '3400', 0),
          (2, '5', 1),
          (3, '23ft', 0),
          (3, '34ft', 1),
          (3, '13ft', 0)
  `;

  const insertDataIntoQuestionsTable = `
      INSERT INTO questions (question) VALUES
        ('Is there drought in California in September 2023?'),
        ('How many COVID hospitalizations in CA in Oct 2021?'),
        ('The water level of the Sacramento River in August 2023 is: ')
      `;

  con.query("DROP TABLE IF EXISTS answers", (err) => {
    if (err) {
      console.error("Error deleting Answers table", err);
    } else {
      console.log("Answers table deleted successfully");
    }
  });

  con.query("DROP TABLE IF EXISTS questions", (err) => {
    if (err) {
      console.error("Error deleting Questions table", err);
    } else {
      console.log("Questions table deleted successfully");
    }
  });

  con.query(createQuestionsTableSQL, (err) => {
    if (err) {
      console.error("Error creating questions table:", err);
    } else {
      console.log("Questions table created successfully");
    }
  });

  con.query(insertDataIntoQuestionsTable, (err) => {
    if (err) {
      console.error("Error insert data into questions table:", err);
    } else {
      console.log("Data inserted into questions table successfully");
    }
  });

  con.query(createAnswersTableSQL, (err) => {
    if (err) {
      console.error("Error creating answers table:", err);
    } else {
      console.log("Answers table created successfully");
    }
  });

  con.query(insertDataIntoAnswersTable, (err) => {
    if (err) {
      console.error("Error inserting data into answers table:", err);
    } else {
      console.log("Data inserted into answers table successfully");
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
