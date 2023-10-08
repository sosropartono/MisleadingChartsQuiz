const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
require("dotenv").config();

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

let userCount = 0;
let currentQuestionIndex = 0;

const surveyData = [
    {
        question: "Question1?",
        chartImage: "chart1.png",
        options: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Question2?",
        chartImage: "chart2.png",
        options: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Question3?",
        chartImage: "chart3.png",
        options: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    {
        question: "Question4?",
        chartImage: "chart4.png",
        options: ["Yes", "No"],
        correctAnswer: "Yes"
    },
    // more questions need to be added
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/start-survey', (req, res) => {
    userCount=0;
    const userId = "User" + (++userCount);
    currentQuestionIndex = 0;

    res.json({ userId, question: surveyData[currentQuestionIndex] });
});

app.post('/submit-response', (req, res) => {
    const { userId, userAnswer } = req.body;

    const currentQuestion = surveyData[currentQuestionIndex];
    const isCorrect = userAnswer === currentQuestion.correctAnswer;
    console.log('Received response from user:', userId, 'with answer:', userAnswer);

    connection.query(
        'INSERT INTO survey_responses (user_id, question, user_answer, is_correct) VALUES (?, ?, ?, ?)',
        [userId, currentQuestion.question, userAnswer, isCorrect],
        (err, results) => {
            if (err) {
                console.error('Error inserting data:', err);
                res.status(500).json({ error: 'Internal Server Error' });
            } else {
                console.log('Data inserted successfully');

                // Move to the next question or end the survey
                currentQuestionIndex++;
                const nextQuestion = surveyData[currentQuestionIndex];

                if (nextQuestion) {
                    res.json({ status: 'success', message: 'User response received', question: nextQuestion });
                } else {
                    res.json({ status: 'success', message: 'Survey complete. Thank you for participating!' });
                }
            }
        }
    );
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
