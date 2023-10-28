import {
  prestudyQuestions,
  displayQuestionnaireQuestions,
  questionnaireContent,
  poststudyQuestions,
  questionnaireMsgElement,
  recordInteraction,
  currentQuestion,
  currentAnswer,
} from "./questionnaire.js";

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
export const homeContent = document.getElementById("home-content");
const quizContent = document.getElementById("quiz-content");
const startPrequizButton = document.getElementById("start-prequiz-button");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");
export const homeButton = document.getElementById("home-button");
export const beginPostQuizButton = document.getElementById("begin-postquiz");
const chartPlaceholder = document.getElementById("chart");

let currentQuestionIndex = 0;
export let quizIsComplete = { value: 0 };
export let userId; // Declare userId globally
let tableData = [];
let data2DArray = [];
let questionOrder = [
  [2, 0, 1],
  [1, 2, 0],
  [0, 2, 1],
]; //temporary array for testing
let questionOrderRow;

// Function to display the question
function displayQuestion() {
  if (currentQuestionIndex < 3) {
    nextButton.style.display = "block";
    questionOrderRow = parseInt(userId.charAt(userId.length - 1)) - 1;

    questionElement.textContent = currentQuestion.value =
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][0];
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
    console.log(currentQuestion.value);

    // Create and append the image element
    const imageElement = document.createElement("img");
    imageElement.src =
      "img/" +
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][1];
    imageElement.alt = "Chart";
    chartPlaceholder.appendChild(imageElement);

    data2DArray[
      questionOrder[questionOrderRow][currentQuestionIndex]
    ][2].forEach((option, index) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      optionsElement.appendChild(label);
    });
  } else {
    // Quiz is complete
    questionElement.textContent =
      "Quiz complete. Thank you for participating! Please take some time to rate your experience in our postquiz.";
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";

    nextButton.style.display = "none";
    homeButton.style.display = "none";
    beginPostQuizButton.style.display = "block";
    currentQuestionIndex = 0;
    quizIsComplete = 1;
  }
}

// Function to show the quiz content and start the survey
async function claimUserID() {
  try {
    // Fetch userId from the server when starting the survey
    const response = await fetch("/claim-user-id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    quizIsComplete.value = 0;
    const data = await response.json();
    userId = data.userId; // Store the userId globally or in a scope accessible by the checkAnswer function
    showUserID.textContent = "Your user ID is: " + userId;
    recordInteraction("Claim User ID");

    console.log(userId);
  } catch (error) {
    console.error("Error claim user ID:", error);
  }
}

export async function startPrequiz() {
  try {
    const response = await fetch("/fetch-entire-table", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    tableData = data;

    storeQuestionsInArray();

    homeContent.style.display = "none"; // Hide the welcome message
    quizContent.style.display = "block"; // Show the quiz content
    homeButton.style.display = "none";

    displayQuestion();
  } catch (error) {
    console.error("Error starting the quiz:", error);
  }
}

function storeQuestionsInArray() {
  for (const entry of tableData.data) {
    const questionText = entry.question_text;
    const chartImage = entry.chart_image;
    const options = entry.options;
    const correctAnswer = entry.correct_answer;

    //temp array with extracted data
    const rowArray = [questionText, chartImage, options, correctAnswer];

    data2DArray.push(rowArray);
  }
}

// Function to check the answer and proceed to the next question
async function checkAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    alert("Please select an answer.");
    return;
  }

  const userAnswer = (currentAnswer.value = selectedOption.value);

  try {
    const responseSubmit = await fetch("/submit-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userAnswer,
        questionNumber: questionOrder[questionOrderRow][currentQuestionIndex],
      }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);

    currentQuestionIndex++;
    displayQuestion(); // Update with the next question from the server
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

// Add event listeners
nextButton.addEventListener("click", () => {
  checkAnswer();
  recordInteraction("Next", 1);
});

startPrequizButton.addEventListener("click", () => {
  recordInteraction("Start Prequiz");
  homeContent.style.display = "none";
  displayQuestionnaireQuestions(prestudyQuestions);
});

claimUserIDButton.addEventListener("click", () => {
  claimUserID();
});
homeButton.addEventListener("click", () => {
  homeContent.style.display = "block";
  quizContent.style.display = "none";
});

beginPostQuizButton.addEventListener("click", () => {
  recordInteraction("Begin PostQuiz");
  quizContent.style.display = "none";
  questionnaireMsgElement.textContent = "PostQuiz";
  displayQuestionnaireQuestions(poststudyQuestions);
});

// Initially, show the welcome message and hide the quiz content
homeContent.style.display = "block";
quizContent.style.display = "none";
questionnaireContent.style.display = "none";
