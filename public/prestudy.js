import {
  userId,
  beginMainStudyButton,
  currentQuestionId,
  prestudyData2DArray
} from "./mainstudy.js";

export const prestudyContent = document.getElementById("prestudy");
const prestudyQuestionElement = document.getElementById("prestudy-question");
const prestudySubmitButton = document.getElementById("prestudy-submit-button");
const startCalibrationButton = document.getElementById(
  "start-calibration-button"
);
export const prestudyMsgElement = document.getElementById("prestudy-msg");
export const calibrationScreen = document.getElementById("calibration-screen");
const prestudyChart = document.getElementById("prestudy-chart");
var inputElement = document.getElementById("inputText");

let currentQuestionIndex = 0;
let userAnswer;
export let currentQuestion = { value: "" };
export let currentAnswer = { value: "" };
export let localQuestions = [
  ["What's your age?", null],
  ["What's your major?", null],
];

//display prestudy questions 1 by 1
export function displayPrestudyQuestions(questions) {
  prestudyContent.style.display = "block";
  prestudySubmitButton.style.display = "block";
  startCalibrationButton.style.display = "none";
  console.log("this is questions length"+ questions.length)


  if (currentQuestionIndex < 2) {
    prestudyQuestionElement.innerHTML = currentQuestion.value =
      localQuestions[currentQuestionIndex][0];
    prestudyChart.innerHTML = "";
    
  } 
  else if (currentQuestionIndex < 12){
    inputElement.style.display = "none"
    console.log("chosen")
    console.log(questions)

      prestudyQuestionElement.textContent = currentQuestion.value = currentQuestionIndex +
      1 + ". " +
      questions[
        [questionOrderRow][currentQuestionIndex]
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

      console.log("second thing called")
  }
  else {
    console.log("called")
    // Survey is complete
    startCalibrationButton.style.display = "block";
    prestudyMsgElement.textContent =
      "Prestudy completed! When you click NEXT, you will be shown a blank screen with a tiny plus sign at the center, please focus your eyes on it for 5 seconds. ";
    prestudyQuestionElement.innerHTML = "";
    prestudySubmitButton.style.display = "none";
    currentQuestionIndex = 0;
    prestudyChart.innerHTML = "";
    inputElement.style.display = "none";
  }
}

//record user response to prestudy questions to database (table prestudy_responses)
async function recordPrestudyResponse() {

  if (currentQuestionIndex < 2){
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
          question: currentQuestion.value.substring(0, 80),
        }),
      });
  
      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
  
      currentQuestionIndex++;
      displayPrestudyQuestions(prestudyData2DArray);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
    inputElement.value = "";
  } else {
    inputElement.style = "display: none"
  }
 
}

//record every button click in database (master_table)
export async function recordInteraction(buttonName, isMainStudy, isPrestudy) {
  let localQuestionId = null;
  let localQuestion = null;
  let localUserAnswer = null;

  if (!isMainStudy && !isPrestudy) {
    localQuestionId = null;
    localQuestion = null;
    localUserAnswer = null;
  } else if (isPrestudy && !isMainStudy) {
    localQuestionId = null;
    localQuestion = currentQuestion.value.substring(0, 80);
    localUserAnswer = currentAnswer.value;
  } else if (isMainStudy && !isPrestudy) {
    localQuestionId = currentQuestionId + 1;
    localQuestion = currentQuestion.value.substring(0, 80);
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

//Record prestudy response and user click when prestudySubmitButton is clicked in prestudy_responses
prestudySubmitButton.addEventListener("click", () => {
  recordPrestudyResponse();
  recordInteraction("Submit", false, true);
});

//records user click, hides prestudy content, displays calibration screen, and hides calibration
//screen while starting main study (after 5 seconds) when beginButton is clicked
startCalibrationButton.addEventListener("click", () => {
  recordInteraction("Start Calibration", false, false);
  prestudyContent.style.display = "none";
  calibrationScreen.style.display = "block";
  setTimeout(() => {
    beginMainStudyButton.style.display = "block";
    calibrationScreen.style.display = "none";
  }, 5000);
});