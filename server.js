const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL database");
});

let userCount = 0;
let currentQuestionIndex = 0;

// Define a route to start the survey
app.post("/claim-user-id", async (req, res) => {
  userCount++;
  const userId = "User" + userCount;
  currentQuestionIndex = 0;

  try {
    // Fetch the total number of questions
    const totalQuestions = await getTotalNumberOfQuestionsFromDatabase();

    // Fetch the first question from the database
    const surveyData = await fetchNextQuestionFromDatabase();
    const [questionData] = surveyData;

    res.json({ userId, totalQuestions, question: questionData });
  } catch (error) {
    console.error("Error fetching next question:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/fetch-entire-table", async (req, res) => {
  try {
    const tableData = await fetchEntireTableFromDatabase("survey_questions");
    res.json({ data: tableData });
  } catch (error) {
    console.error("Error fetching table data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Define a route to submit a response
app.post("/submit-response", async (req, res) => {
  const { userId, userAnswer } = req.body;

  try {
    // Fetch the current question from the database
    const surveyData = await fetchNextQuestionFromDatabase();
    const [currentQuestion] = surveyData;
    const isCorrect = userAnswer === currentQuestion.correct_answer;

    // Insert the response into the database
    await insertResponseIntoDatabase(
      userId,
      currentQuestion,
      userAnswer,
      isCorrect
    );

    // Move to the next question or end the survey
    currentQuestionIndex++;

    // Fetch the total number of questions
    const totalQuestions = await getTotalNumberOfQuestionsFromDatabase();

    if (currentQuestionIndex < totalQuestions) {
      // Continue with the survey
      const [nextQuestion] = await fetchNextQuestionFromDatabase();
      res.json({
        status: "success",
        message: "User response received",
        question: nextQuestion,
      });
    } else {
      // End the survey
      res.json({
        status: "success",
        message: "Survey complete. Thank you for participating!",
      });
    }
  } catch (error) {
    console.error("Error submitting response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

// Function to fetch the next question from the database
function fetchNextQuestionFromDatabase() {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM survey_questions LIMIT ?, 1";
    connection.query(query, [currentQuestionIndex], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

// Function to fetch the total number of questions from the database
function getTotalNumberOfQuestionsFromDatabase() {
  return new Promise((resolve, reject) => {
    const query = "SELECT COUNT(*) as total FROM survey_questions";
    connection.query(query, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results[0].total);
      }
    });
  });
}

// Function to insert a response into the database
function insertResponseIntoDatabase(userId, question, userAnswer, isCorrect) {
  return new Promise((resolve, reject) => {
    const query =
      "INSERT INTO survey_responses (user_id, question, user_answer, is_correct) VALUES (?, ?, ?, ?)";
    connection.query(
      query,
      [userId, question.question_text, userAnswer, isCorrect],
      (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });
}

function fetchEntireTableFromDatabase(tableName) {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM ${tableName}`;
    connection.query(query, (err, results) => {
      if (err) {
        console.error("Error fetching table data:", err);
        reject(err);
      } else {
        console.log("Fetched table data:", results);
        resolve(results);
      }
    });
  });
}
