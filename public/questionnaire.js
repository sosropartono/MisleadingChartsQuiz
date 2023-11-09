import {
  userId,
  quizIsComplete,
  startQuiz,
  currentQuestionId,
} from "./quizsurvey.js";

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
    ["Specify your age range:", ["10-25", "26+"]],
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

export async function recordInteraction(
  buttonName,
  isMainQuiz,
  isQuestionnaire
) {
  let localQuestionId = null;
  let localQuestion = null;
  let localUserAnswer = null;

  if (!isMainQuiz && !isQuestionnaire) {
    localQuestionId = null;
    localQuestion = null;
    localUserAnswer = null;
  } else if (isQuestionnaire && !isMainQuiz) {
    localQuestionId = null;
    localQuestion = currentQuestion.value;
    localUserAnswer = currentAnswer.value;
  } else if (isMainQuiz && !isQuestionnaire) {
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
questionnaireNextButton.addEventListener("click", () => {
  recordQuestionnaireAnswer();
  console.log(currentQuestionId);
  recordInteraction("Next", false, true);
});

beginButton.addEventListener("click", () => {
  recordInteraction("Begin Quiz", false, false);
  questionnaireContent.style.display = "none";
  startQuiz();
});
