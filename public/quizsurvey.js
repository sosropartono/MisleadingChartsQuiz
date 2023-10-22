const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const homeContent = document.getElementById("home-content");
const quizContent = document.getElementById("quiz-content");
const startSurveyButton = document.getElementById("start-survey-button");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");
const homeButton = document.getElementById("home-button");
// var loadingBar = document.getElementById("countdown-bar");
// var progress = 0;

let currentQuestionIndex = 0;
let userId; // Declare userId globally
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
    questionOrderRow = parseInt(userId.charAt(userId.length - 1)) - 1;

    questionElement.textContent =
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][0];
    optionsElement.innerHTML = "";

    // Create and append the image element
    const imageElement = document.createElement("img");
    imageElement.src =
      data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][1];
    imageElement.alt = "Chart";
    optionsElement.appendChild(imageElement);

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
    // Survey is complete
    questionElement.textContent =
      "Survey complete. Thank you for participating!";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none";
    homeButton.style.display = "block";
    // setInterval(updateProgress, 100);
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

    const data = await response.json();
    userId = data.userId; // Store the userId globally or in a scope accessible by the checkAnswer function
    showUserID.textContent = "Your user ID is: " + userId;

    console.log(userId);
  } catch (error) {
    console.error("Error claim user ID:", error);
  }
}

async function startSurvey() {
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

    displayQuestion();
  } catch (error) {
    console.error("Error starting the survey:", error);
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

  const userAnswer = selectedOption.value;

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

function updateProgress() {
  progress += 0.1;
  loadingBar.style.width = progress * 100 + "%";
}

// Add event listeners
nextButton.addEventListener("click", checkAnswer);
startSurveyButton.addEventListener("click", startSurvey);
claimUserIDButton.addEventListener("click", claimUserID);
homeButton.addEventListener("click", () => {
  homeContent.style.display = "block";
  quizContent.style.display = "none";
});

// Initially, show the welcome message and hide the quiz content
homeContent.style.display = "block";
quizContent.style.display = "none";
