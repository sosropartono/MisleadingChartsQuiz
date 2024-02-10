import {
  userId,
  beginMainStudyButton,
  currentQuestionId,
  prestudyData2DArray,
} from "./mainstudy.js";

export const prestudyContent = document.getElementById("prestudy");
const prestudyQuestionElement = document.getElementById("prestudy-question");
const prestudySubmitButton = document.getElementById("prestudy-submit-button");
const startCalibrationButton = document.getElementById(
  "start-calibration-button"
);
export const prestudyMsgElement = document.getElementById("prestudy-msg");
export const calibrationScreen = document.getElementById("calibration-screen");
const prestudyOption = document.getElementById("prestudy-options")
var inputElement = document.getElementById("inputText");
let correct_ans
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


  // if (currentQuestionIndex < 2) {
  //   prestudyQuestionElement.innerHTML = currentQuestion.value =
  //     localQuestions[currentQuestionIndex][0];
    
  // } 
  // else if (currentQuestionIndex < questions.length){
  //   inputElement.style.display = "none"
  //   prestudyQuestionElement.innerHTML = ""
  //   prestudyOption.innerHTML = ""
  //   prestudyMsgElement.textContent = "Below is a prompt in English. Answer the following prompt with the most appropriate response."

  //   if (currentQuestionIndex > 6){
  //     prestudyMsgElement.textContent = "Below is a prompt in Spanish. Answer the following prompt with the most appropriate response."
  //   }

  //     prestudyQuestionElement.innerHTML = currentQuestion.value = questions[currentQuestionIndex][0];

  //     questions[currentQuestionIndex][1].forEach((option, index) => {
  //       const label = document.createElement("label");
  //       const input = document.createElement("input");
  //       input.type = "radio";
  //       input.name = "answer";
  //       input.value = option;
  //       label.appendChild(input);
  //       label.appendChild(document.createTextNode(option));
  //       prestudyOption.appendChild(label);
  //     });

  // }
  // else {
    // Survey is complete
    startCalibrationButton.style.display = "block";
    prestudyMsgElement.textContent =
      "Prestudy completed! When you click NEXT, you will be shown a blank screen with a tiny plus sign at the center, please focus your eyes on it for 5 seconds. ";
    
      prestudyQuestionElement.innerHTML = "";
    prestudySubmitButton.style.display = "none";
    currentQuestionIndex = 0;
    inputElement.style.display = "none";
    prestudyQuestionElement.style.display = "none"
    prestudyOption.style.display = "none"
  }
// }

// user_id VARCHAR(10) NOT NULL,
// question_id INT,
// question VARCHAR(255),
// user_answer VARCHAR(255),
// is_correct VARCHAR(5) NOT NULL,
// timestamp VARCHAR(40)

//record user response to prestudy questions to database (table prestudy_responses)
async function recordPrestudyResponse() {

  if (currentQuestionIndex < 2){
    var inputValue = inputElement.value;

    if (!inputValue) {
      alert("Please enter an answer.");
      return;
    }
  
    userAnswer = currentAnswer.value = inputValue;
    let ans = true
  
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
  

      console.log(userId, currentQuestionIndex + 1, question, userAnswer, ans)

  
      const dataSubmit = await responseSubmit.json();
      console.log("server response", dataSubmit)
  
      currentQuestionIndex++;
      displayPrestudyQuestions(prestudyData2DArray);
    } catch (error) {
      console.error("Error submitting response:", error);
    }
    inputElement.value = "";
  }else{

    let selectedOption = (currentAnswer.value = document.querySelector(
      'input[name="answer"]:checked'
    ).value);
  
    let currentCorrectAnswer = prestudyData2DArray[currentQuestionIndex][2]
  
    if (!selectedOption) {
      alert("Please select an answer.");
      return;
    }
  
    try {
      const responseSubmit = await fetch("/submit-prestudy-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          question: currentQuestion.value.substring(0, 100),
          userAnswer: selectedOption,
          isCorrect: selectedOption === currentCorrectAnswer,
        }),
      });
  
      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
  
      currentQuestionIndex++;
      displayPrestudyQuestions(prestudyData2DArray);
    } catch (error) {
      console.error("Error submitting response:", error);
    }

  }}
  

        

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
  }, 0);
});