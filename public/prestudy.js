import { userId, startStudy, currentQuestionId } from "./mainstudy.js";

export const prestudyContent = document.getElementById("prestudy");
const prestudyQuestionElement = document.getElementById("prestudy-question");
const prestudyNextButton = document.getElementById("prestudy-next-button");
const beginButton = document.getElementById("begin-button");
export const prestudyMsgElement = document.getElementById("prestudy-msg");
const calibrationScreen = document.getElementById("calibration-screen");
const prestudyChart = document.getElementById("prestudy-chart");
var inputElement = document.getElementById("inputText");

let currentQuestionIndex = 0;
let userAnswer;
export let currentQuestion = { value: "" };
export let currentAnswer = { value: "" };
export let prestudyQuestions = [
  ["What's your name?", null],
  ["What's your major?", null],
  [
    "The graph above shows the percentage of people who die from different types of cancer." +
      "\nAbout what percentage of people who die from cancer die from cancer B, cancer C, and cancer D combined?",
    "pie-chart.png",
  ],
  [
    "You see two magazines advertisements on separate pages. Each advertisement is for a different " +
      "drug for treating heart disease. Each advertisement has a graph for showing the effectiveness of the drug " +
      "compared to a placebo (sugar pill).\nCompared to the placebo, which treatment leads to a larger decrease " +
      "in the percentage of patients who die? \n Please enter an answer from the following: Crosicol, Hertinol, They are equal, Can't say",
    "bar-graph.png",
  ],

  [
    "The graph above shows the number of men and women with disease X. The total number of circles is 100.\n" +
      "How many more men than women are there among 100 patients with disease X?",
    "dots.png",
  ],

  [
    "You see two newspaper advertisements on separate pages. Each advertisement is for a different treatment of a skin " +
      "disease. Each advertisement has a graph showing the effectiveness of the treatment over time.\n" +
      "Which of the treatments show a larger decrease in the percentage of sick patients?" +
      "\nPlease enter an answer from the following: Apsoriatin, Nopsorian, They are equal, Can't say",
    "line-graph.png",
  ],
];

export function displayPrestudyQuestions(questions) {
  prestudyContent.style.display = "block";
  prestudyNextButton.style.display = "block";
  beginButton.style.display = "none";

  console.log("displayPrestudyQuestions is called");

  if (currentQuestionIndex < 6) {
    prestudyQuestionElement.textContent = currentQuestion.value =
      questions[currentQuestionIndex][0];
    prestudyChart.innerHTML = "";

    console.log(currentQuestion.value);

    var imageElement = document.createElement("img");
    if (questions[currentQuestionIndex][1] != null) {
      imageElement.src =
        "img/prestudy-img/" + questions[currentQuestionIndex][1];
      imageElement.alt = "prestudy Chart";
      imageElement.style.width = "auto";
      imageElement.style.height = "400px";
      prestudyChart.appendChild(imageElement);
    }
  } else {
    // Survey is complete
    beginButton.style.display = "block";
    prestudyMsgElement.textContent =
      "Prestudy completed! When you click BEGIN, you will be shown a blank screen with a tiny plus sign at the center, please focus your eyes on it for 5 seconds. ";
    prestudyQuestionElement.textContent = "";
    prestudyNextButton.style.display = "none";
    currentQuestionIndex = 0;
    prestudyChart.innerHTML = "";
    inputElement.style.display = "none";
  }
}

async function recordPrestudyResponse() {
  var inputValue = inputElement.value;

  if (!inputValue) {
    alert("Please enter an answer.");
    return;
  }
  console.log(inputValue);

  userAnswer = currentAnswer.value = inputValue;

  try {
    const responseSubmit = await fetch("/submit-prestudy-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userAnswer,
        question: prestudyQuestionElement.textContent,
      }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);

    currentQuestionIndex++;
    displayPrestudyQuestions(prestudyQuestions);
  } catch (error) {
    console.error("Error submitting response:", error);
  }
  inputElement.value = "";
}

export async function recordInteraction(buttonName, isMainStudy, isprestudy) {
  let localQuestionId = null;
  let localQuestion = null;
  let localUserAnswer = null;

  if (!isMainStudy && !isprestudy) {
    localQuestionId = null;
    localQuestion = null;
    localUserAnswer = null;
  } else if (isprestudy && !isMainStudy) {
    localQuestionId = null;
    localQuestion = currentQuestion.value;
    localUserAnswer = currentAnswer.value;
  } else if (isMainStudy && !isprestudy) {
    localQuestionId = currentQuestionId + 1;
    localQuestion = currentQuestion.value;
    localUserAnswer = currentAnswer.value;
  }
  try {
    const responseSubmit = await fetch("/submit-user-interaction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        buttonName,
        questionId: localQuestionId,
        question: localQuestion,
        userAnswer: localUserAnswer,
      }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

// Add event listeners
prestudyNextButton.addEventListener("click", () => {
  recordPrestudyResponse();
  recordInteraction("Next", false, true);
});

beginButton.addEventListener("click", () => {
  recordInteraction("Begin Study", false, false);
  prestudyContent.style.display = "none";
  calibrationScreen.style.display = "block";
  setTimeout(() => {
    startStudy();
    calibrationScreen.style.display = "none";
  }, 6000);
});
