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

const questionElement = document.getElementById("question");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const homeContent = document.getElementById("home-content");
const quizContent = document.getElementById("quiz-content");
const startSurveyButton = document.getElementById("start-survey-button");

let currentQuestionIndex = 0;
let userId; // Declare userId globally

// Function to display the question
function displayQuestion() {
  const questionData = surveyData[currentQuestionIndex];

  if (questionData) {
      questionElement.textContent = questionData.question;
      optionsElement.innerHTML = "";

      // Create and append the image element
      const imageElement = document.createElement("img");
      imageElement.src = questionData.chartImage;
      imageElement.alt = "Chart";
      optionsElement.appendChild(imageElement);

      questionData.options.forEach((option, index) => {
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
      questionElement.textContent = "Survey complete. Thank you for participating!";
      optionsElement.innerHTML = "";
      nextButton.style.display = "none";
  }
}

// Function to show the quiz content and start the survey
async function startSurvey() {
  try {
      // Fetch userId from the server when starting the survey
      const response = await fetch('/start-survey', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      const data = await response.json();
      userId = data.userId; // Store the userId globally or in a scope accessible by the checkAnswer function

      homeContent.style.display = "none"; // Hide the welcome message
      quizContent.style.display = "block"; // Show the quiz content

      // Initialize the quiz
      displayQuestion();
  } catch (error) {
      console.error('Error starting the survey:', error);
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
  const correctAnswer = surveyData[currentQuestionIndex].correctAnswer;

  if (userAnswer === correctAnswer) {
      alert("Correct answer!");
  } else {
      alert("Incorrect answer");
  }

  try {
      const responseSubmit = await fetch('/submit-response', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, userAnswer }),
      });

      const dataSubmit = await responseSubmit.json();
      console.log('Server response:', dataSubmit);
  } catch (error) {
      console.error('Error submitting response:', error);
  }

  currentQuestionIndex++;
  displayQuestion();
}

// Add event listeners
nextButton.addEventListener("click", checkAnswer);
startSurveyButton.addEventListener("click", startSurvey);

// Initially, show the welcome message and hide the quiz content
homeContent.style.display = "block";
quizContent.style.display = "none";