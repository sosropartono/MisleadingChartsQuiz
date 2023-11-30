import {
  prestudyQuestions,
  displayPrestudyQuestions,
  prestudyContent,
  recordInteraction,
  currentQuestion,
  currentAnswer,
} from "./prestudy.js";

import { questionOrder } from "./mainStudyOrderSequence.js";

//main study elements
const studyContent = document.getElementById("study-content");
const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");

//welcome screen or home screen
export const homeContent = document.getElementById("home-content");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");

//prestudy elements
const startPrestudyButton = document.getElementById("start-prestudy-button");
const chartPlaceholder = document.getElementById("chart");

//end of study
const postStudyCongrats = document.getElementById("congrats-cat");

let currentQuestionIndex = 0;
export let userId; //Declare userId globally
let tableData = [];
let data2DArray = []; //stores all queries from test_questions in database locally

let questionOrderRow;
export let currentQuestionId;

// Function to display the question
function displayQuestion() {
  if (currentQuestionIndex < 3) {
    nextButton.style.display = "block";
    questionOrderRow = parseInt(userId.charAt(userId.length - 1)) - 1;

    questionElement.textContent = currentQuestion.value =
      currentQuestionIndex +
      1 +
      ". " +
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][0];
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
    currentQuestionId = questionOrder[questionOrderRow][currentQuestionIndex];
    console.log(currentQuestion.value);

    // Create and append the image element
    const imageElement = document.createElement("img");
    imageElement.src =
      "img/" +
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][1];
    imageElement.alt = "Chart";
    imageElement.style.width = "auto"; // Set the desired width
    imageElement.style.height = "600px"; // Set the desired height
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
    // Study is complete
    postStudyCongrats.style.display = "block";
    questionElement.textContent =
      "Study complete. Thank you for participating!";
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
    nextButton.style.display = "none";
    currentQuestionIndex = 0;
  }
}

// Function to show the study content and start the survey
async function claimUserID() {
  try {
    // Fetch userId from the server when starting the survey
    const response = await fetch("/claim-user-id", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    userId = data.userId; // Store the userId globally or in a scope accessible by the checkAnswer function
    showUserID.textContent = "Your user ID is: " + userId;
    recordInteraction("Claim User ID", false, false);

    console.log(userId);
    claimUserIDButton.style.display = "none";
    startPrestudyButton.style.display = "block";
  } catch (error) {
    console.error("Error claim user ID:", error);
  }
}

export async function startStudy() {
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
    studyContent.style.display = "block"; // Show the study content

    displayQuestion();
  } catch (error) {
    console.error("Error starting the study:", error);
  }
}

function storeQuestionsInArray() {
  for (const entry of tableData.data) {
    const questionText = entry.question_text;
    const chartImage = entry.chart_image;
    const options = entry.options;
    const correctAnswer = entry.correct_answer;
    const questionID = entry.question_id;

    //temp array with extracted data
    const rowArray = [
      questionText,
      chartImage,
      options,
      correctAnswer,
      questionID,
    ];

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
  recordInteraction("Next", true, false);
});

startPrestudyButton.addEventListener("click", () => {
  recordInteraction("Start Prestudy", false, false);
  homeContent.style.display = "none";
  displayPrestudyQuestions(prestudyQuestions);
});

claimUserIDButton.addEventListener("click", () => {
  claimUserID();
});

// Initially, show the welcome message and hide the study content
homeContent.style.display = "block";
studyContent.style.display = "none";
prestudyContent.style.display = "none";
