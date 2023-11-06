import { userId, quizIsComplete, startQuiz } from "./quizsurvey.js";

export const questionnaireContent = document.getElementById("questionnaire");
const questionnaireQuestionElement = document.getElementById(
  "questionnaire-question"
);
const questionnaireOptionElement = document.getElementById(
  "questionnaire-options"
);
const questionnaireNextButton = document.getElementById(
  "questionnaire-next-button"
);
const beginButton = document.getElementById("begin-button");
export const questionnaireMsgElement =
  document.getElementById("questionnaire-msg");

let currentQuestionIndex = 0;
let responseTableName, questionTableName;
let userAnswer;
export let currentQuestion = { value: "" };
export let currentAnswer = { value: "" };
export const prestudyQuestions = [
  [
    ["Specify your age range:", ["10-25", "25+"]],
    ["Do you work with charts often?", ["yes", "no"]],
    ["Have you ever been a part of a user study?", ["Absolutely", "No"]],
  ],
];

export const poststudyQuestions = [
  [
    ["Are you confident with your answers?", ["yes1", "no"]],
    ["Were the graphs confusing?", ["yes2", "no"]],
    ["Would you participate in a user study again?", ["Yes3", "No"]],
  ],
];

export function displayQuestionnaireQuestions(questions) {
  questionnaireContent.style.display = "block";
  questionnaireNextButton.style.display = "block";
  beginButton.style.display = "none";

  console.log("displayQuestionnaireQuestions is called");

  if (currentQuestionIndex < 3) {
    questionnaireQuestionElement.textContent = currentQuestion.value =
      questions[0][currentQuestionIndex][0];
    questionnaireOptionElement.innerHTML = "";
    console.log(currentQuestion.value);

    questions[0][currentQuestionIndex][1].forEach((option, index) => {
      const label = document.createElement("label");
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      label.appendChild(input);
      label.appendChild(document.createTextNode(option));
      questionnaireOptionElement.appendChild(label);
    });
  } else {
    // Survey is complete

    if (quizIsComplete.value == 0) {
      beginButton.style.display = "block";
      questionnaireMsgElement.textContent = "Questionnaire complete!";
    } else {
      questionnaireMsgElement.textContent =
        "PostQuiz completed! Thank you for being a part of our study.";
    }
    questionnaireQuestionElement.textContent = "";
    questionnaireOptionElement.innerHTML = "";
    questionnaireNextButton.style.display = "none";
    currentQuestionIndex = 0;
  }
}

async function recordQuestionnaireAnswer() {
  const selectedOption = document.querySelector('input[name="answer"]:checked');

  if (!selectedOption) {
    alert("Please select an answer.");
    return;
  }
  console.log(selectedOption.value);

  userAnswer = currentAnswer.value = selectedOption.value;
  if (quizIsComplete.value == 0) {
    responseTableName = "prestudy_responses";
    questionTableName = prestudyQuestions;
  } else {
    responseTableName = "poststudy_responses";
    questionTableName = poststudyQuestions;
  }

  try {
    const responseSubmit = await fetch("/submit-questionnaire-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userAnswer,
        question: questionnaireQuestionElement.textContent,
        responseTableName,
      }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);

    currentQuestionIndex++;
    displayQuestionnaireQuestions(questionTableName);
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

export async function recordInteraction(buttonName, quest) {
  try {
    if (quest == null) {
      const responseSubmit = await fetch("/submit-user-interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          buttonName,
          question: null,
          userAnswer: null,
        }),
      });

      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
    } else {
      console.log("recordInteraction " + currentQuestion.value);
      const responseSubmit = await fetch("/submit-user-interaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          buttonName,
          question: currentQuestion.value,
          userAnswer: currentAnswer.value,
        }),
      });

      const dataSubmit = await responseSubmit.json();
      console.log("Server response:", dataSubmit);
    }
  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

// Add event listeners
questionnaireNextButton.addEventListener("click", () => {
  recordQuestionnaireAnswer();
  recordInteraction("Next", 1);
});

beginButton.addEventListener("click", () => {
  recordInteraction("Begin Quiz");
  questionnaireContent.style.display = "none";
  startQuiz();
});
