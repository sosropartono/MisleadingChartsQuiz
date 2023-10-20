const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const homeContent = document.getElementById("home-content");
const quizContent = document.getElementById("quiz-content");
const startSurveyButton = document.getElementById("start-survey-button");

let currentQuestionIndex = 0;
let userId = 1; // Declare userId globally
let tableData = [];
let data2DArray = [];
let questionOrder = [2, 0, 1]; //temporary array for testing

// Function to display the question
function displayQuestion() {
  if (questionOrder) {
    questionOrder.forEach((quest, index) => {
      questionElement.textContent = data2DArray[quest][0];
      optionsElement.innerHTML = "";

      // Create and append the image element
      const imageElement = document.createElement("img");
      imageElement.src = data2DArray[quest][1];
      imageElement.alt = "Chart";
      optionsElement.appendChild(imageElement);

      data2DArray[quest][2].forEach((option, index) => {
        const label = document.createElement("label");
        const input = document.createElement("input");
        input.type = "radio";
        input.name = "answer";
        input.value = option;
        label.appendChild(input);
        label.appendChild(document.createTextNode(option));
        optionsElement.appendChild(label);
      });
    });
  } else {
    // Survey is complete
    questionElement.textContent =
      "Survey complete. Thank you for participating!";
    optionsElement.innerHTML = "";
    nextButton.style.display = "none";
  }
}

// // Function to show the quiz content and start the survey
// async function startSurvey() {
//   try {
//     // Fetch userId from the server when starting the survey
//     const response = await fetch("/start-survey", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });

//     const data = await response.json();
//     userId = data.userId; // Store the userId globally or in a scope accessible by the checkAnswer function

//     homeContent.style.display = "none"; // Hide the welcome message
//     quizContent.style.display = "block"; // Show the quiz content

//     // Initialize the quiz
//     displayQuestion(data.question);
//   } catch (error) {
//     console.error("Error starting the survey:", error);
//   }
// }

async function startSurvey2() {
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
      body: JSON.stringify({ userId, userAnswer }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);

    currentQuestionIndex++;
    displayQuestion(dataSubmit.question); // Update with the next question from the server
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

// Add event listeners
nextButton.addEventListener("click", checkAnswer);
startSurveyButton.addEventListener("click", startSurvey2);

// Initially, show the welcome message and hide the quiz content
homeContent.style.display = "block";
quizContent.style.display = "none";
