const questionElement = document.getElementById("question-container");
const optionsElement = document.getElementById("options");
const nextButton = document.getElementById("next-button");
const homeContent = document.getElementById("home-content");
const quizContent = document.getElementById("quiz-content");
const startSurveyButton = document.getElementById("start-survey-button");

const baseQuestionUrl = "http://localhost:3000/questions";
const baseAnsURl = "http://localhost:3000/answers";

var opts = {
  url: baseQuestionUrl,
};

fetch(opts)
  .then((res) => {
    if (res.ok) {
      return res.json();
    }
  })
  .then((questions) => {
    for (let question of questions) {
      console.log(question);
    }
  })
  .catch(console.log);

https: startSurveyButton.addEventListener("click", startSurvey);
async function startSurvey(e) {
  e.preventDefault();
  const res = await fetch(baseQuestionUrl, {
    method: "GET",
  });
  console.log(res);
  const data = await res.json();
  questionElement.textContent = data.questions;
}

function displayQuestions(questions) {
  questionElement.innerHTML = "";

  questions.forEach(function (question, index) {
    const questionElement = document.createElement("div");
    questionElement.textContent = `${index + 1}. ${question.question}`;
    // questionsElement.appendChild(questionElement);
  });

  homeContent.style.display = "none";
  quizContent.style.display = "block";
}

// let questionsNumberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
// let randomNumber;

// function randomlyRearrangeQuestions() {
//   let tempNumberHolder;

//   for (let index = 0; index < questionsNumberArray.length; index++) {
//     randomNumber = Math.floor(Math.random * 10); //return random integer from 0 to 9
//     tempNumberHolder = questionsNumberArray[index];
//     questionsNumberArray[index] = questionsNumberArray[randomNumber];
//     questionsNumberArray[randomNumber] = tempNumberHolder;
//   }

//   return questionsNumberArray;
// }

// randomlyRearrangeQuestions();

//Initially, show the welcome message and hide the quiz content
homeContent.style.display = "block";
quizContent.style.display = "none";

//Add event listeners
nextButton.addEventListener("click", checkAnswer);
