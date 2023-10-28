//Node questionsAndAnswers.js
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

  const createTableSQL = `
    CREATE TABLE IF NOT EXISTS survey_questions (
      question_text VARCHAR(255) NOT NULL,
      chart_image VARCHAR(255) NOT NULL,
      options JSON NOT NULL,
      correct_answer VARCHAR(255) NOT NULL
    )
  `;

  const createPrestudyResponsesTable = `
  CREATE TABLE IF NOT EXISTS prestudy_responses (
    user_id VARCHAR(10) NOT NULL,
    question_text VARCHAR(255),
    user_answer VARCHAR(30),
    timestamp VARCHAR(40)
  )
`;

  const createPoststudyResponsesTable = `
  CREATE TABLE IF NOT EXISTS poststudy_responses (
    user_id VARCHAR(10) NOT NULL,
    question_text VARCHAR(255) NOT NULL,
    user_answer VARCHAR(30) NOT NULL,
    timestamp VARCHAR(40)
  )
`;

  const createResponsesTableSQL = `
    CREATE TABLE IF NOT EXISTS survey_responses (
      user_id VARCHAR(10) NOT NULL,
      question VARCHAR(100),
      user_answer VARCHAR(10),
      is_correct VARCHAR(5) NOT NULL,
      timestamp VARCHAR(40)
    )
  `;

  const createMasterTable = `
  CREATE TABLE IF NOT EXISTS master_table (
    user_id VARCHAR(10) NOT NULL,
    button_name VARCHAR(100),
    question_text VARCHAR(50),
    user_answer VARCHAR(10),
    timestamp VARCHAR(40)
  )
`;

  //1 for correct answer and 0 for wrong answer
  const insertDataIntoSurveyQuestionsTable = `
    INSERT INTO survey_questions (question_text, chart_image, options, correct_answer)
    VALUES
      ('Question1?', 'color_chart.png', '["yes1", "no"]', 'yes1'),
      ('Question2?', 'color_chart.png', '["yes2", "no"]', 'no'),
      ('Question3?', 'color_chart.png', '["Yes3", "No"]', 'Yes3')
  `;

  // Drop the table if already exist
  con.query("DROP TABLE IF EXISTS survey_questions", (err) => {
    if (err) {
      console.error("Error deleting survey_questions table", err);
    } else {
      console.log("survey_questions table deleted successfully");
    }
  });

  // create table after dropping the table
  con.query(createTableSQL, (err) => {
    if (err) {
      console.error("Error creating survey_questions table:", err);
    } else {
      console.log("survey_questions table created successfully");
    }
  });

  // insert data after creating the table
  con.query(insertDataIntoSurveyQuestionsTable, (err) => {
    if (err) {
      console.error("Error inserting data into survey_questions table:", err);
    } else {
      console.log("Data inserted into survey_questions table successfully");
    }
  });

  con.query("DROP TABLE IF EXISTS survey_responses", (err) => {
    if (err) {
      console.error("Error deleting survey_responses table:", err);
    } else {
      console.log("survey_responses table deleted successfully");
    }
  });

  con.query(createResponsesTableSQL, (err) => {
    if (err) {
      console.error("Error creating survey_responses table:", err);
    } else {
      console.log("survey_responses table created successfully");
    }
  });

  con.query("DROP TABLE IF EXISTS poststudy_responses", (err) => {
    if (err) {
      console.error("Error deleting survey_responses table:", err);
    } else {
      console.log("survey_responses table deleted successfully");
    }
  });

  con.query("DROP TABLE IF EXISTS prestudy_responses", (err) => {
    if (err) {
      console.error("Error deleting survey_responses table:", err);
    } else {
      console.log("survey_responses table deleted successfully");
    }
  });

  con.query(createPoststudyResponsesTable, (err) => {
    if (err) {
      console.error("Error creating poststudy_questions table:", err);
    } else {
      console.log("poststudy_questions table created successfully");
    }
  });

  con.query(createPrestudyResponsesTable, (err) => {
    if (err) {
      console.error("Error creating poststudy_questions table:", err);
    } else {
      console.log("poststudy_questions table created successfully");
    }
  });

  con.query("DROP TABLE IF EXISTS master_table", (err) => {
    if (err) {
      console.error("Error deleting master_table", err);
    } else {
      console.log("master_table deleted successfully");
    }
  });

  // create table after dropping the table
  con.query(createMasterTable, (err) => {
    if (err) {
      console.error("Error creating master_table:", err);
    } else {
      console.log("master_table created successfully");
    }
  });

  // Close the connection
  con.end((error) => {
    if (error) {
      console.error("Error closing MySQL connection:", error);
      return;
    }
    console.log("MySQL connection closed.");
  });
});
