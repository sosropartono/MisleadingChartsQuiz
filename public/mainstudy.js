import {
  displayPrestudyQuestions,
  prestudyContent,
  recordInteraction,
  currentQuestion,
  currentAnswer,
  calibrationScreen,
} from "./prestudy.js";

import { questionOrder } from "./mainStudyOrderSequence.js";

//main study elements
const studyContent = document.getElementById("study-content");
const questionElement = document.getElementById("question");
// const optionsElement = document.getElementById("options");
const submitButton = document.getElementById("submit-button");
const prestudyNotif = document.getElementById("prestudy-notif");
const beginStudyButton = document.getElementById("begin-study-button");
export const beginMainStudyButton = document.getElementById(
  "begin-main-study-button"
);
const optionAContainer = document.getElementById("option-a-container")
const optionBContainer = document.getElementById("option-b-container")
const optionA = document.getElementById("option-a")
const optionB = document.getElementById("option-b")
const optionAList = document.getElementById("option-a-list")
const optionBList = document.getElementById("option-b-list")
let mainQuestion; 

const configuration = ""





//welcome screen or home screen
export const homeContent = document.getElementById("home-content");
const claimUserIDButton = document.getElementById("claim-user-id");
const showUserID = document.getElementById("show-user-id");

//prestudy elements
const beginPrestudyButton = document.getElementById("begin-prestudy-button");
const imagePlaceholder = document.getElementById("image");

//end of study
const postStudyCongrats = document.getElementById("congrats-cat");

export let currentQuestionId;
let currentQuestionIndex = 0;
let currentCorrectAnswer;
export let userId = 0; //Declare userId globally
let questionOrderRow;

let tableData = [];
export let data2DArray = []; //stores all queries from test_questions in database locally

export let prestudyTableData = [];
export let prestudyData2DArray = [];



// Look at main question console log
// See what batch range it is 
// then look at that function to make sure it's displaying correctly
// enough to fill up the page
const decideBatch = (mainQuestion) => {

  // A: Eng B: Esp C: Eng, D: Esp
  const imageElement = document.createElement("img");
  imageElement.id = "actual-image"

  imageElement.alt = "image";
  imageElement.style.width = "100%"
  imageElement.style.height = "auto"
  

  console.log("Main Question Index", mainQuestion)
//Batch A
if (mainQuestion >= 1 && mainQuestion <= 18) {
    imageElement.src = "img/" + data2DArray[mainQuestion][2][0];
    imagePlaceholder.appendChild(imageElement);
    generateBatchA(mainQuestion)
} 
//Batch B
else if (mainQuestion >= 19 && mainQuestion <= 36) {
  imageElement.src = "img/" + data2DArray[mainQuestion][2][1];
  imagePlaceholder.appendChild(imageElement);
  generateBatchB(mainQuestion)
} 
//Batch C
else if (mainQuestion >= 37 && mainQuestion <= 54) {
  imageElement.src = "img/" + data2DArray[mainQuestion][2][0];
  imagePlaceholder.appendChild(imageElement);
  generateBatchC(mainQuestion)
} 
//Batch D
else if (mainQuestion >= 55 && mainQuestion <= 72) {
  imageElement.src = "img/" + data2DArray[mainQuestion][2][1];
  imagePlaceholder.appendChild(imageElement);
  generateBatchD(mainQuestion)
} else {
    console.log("Number is outside the specified tiers");
}

}

//display main study questions 1 by 1
// question 1... question 2.. 
// currentQuestionIndex 1 2 3 4 5 6
function displayQuestion() {
  if (currentQuestionIndex < 72) {
    submitButton.style.display = "block";
    questionOrderRow = (userId - 1) % questionOrder.length;
    mainQuestion = questionOrder[questionOrderRow][currentQuestionIndex]

    decideBatch(mainQuestion)
    console.log(data2DArray);



    questionElement.textContent = currentQuestion.value =
      currentQuestionIndex +
      1 + ". " + "Choose your preferred list of recommendations\n" + 
      "." + "Below is an article, please select the option that you would like to see recommended to you"
      
      
    // optionsElement.style.display = "flex"
    // currentQuestionId = questionOrder[questionOrderRow][currentQuestionIndex];

    //assign this question's correct answer to currentCorrectAnswer for answer checking
    // currentCorrectAnswer =
    //   data2DArray[questionOrder[questionOrderRow][currentQuestionIndex]][3];

    // Create and append the image element




    // option a or option b
    // we need to iterate and generate those things
    // data2DArray[
    //   questionOrder[questionOrderRow][currentQuestionIndex]
    // ][2].forEach((option, index) => {
    //   const label = document.createElement("label");
    //   const input = document.createElement("input");
    //   input.type = "radio";
    //   input.name = "answer";
    //   input.value = option;
    //   label.appendChild(input);
    //   label.appendChild(document.createTextNode(option));
    //   optionsElement.appendChild(label);
    // });
  } else {
    //Study is complete
    currentQuestionIndex = 0;
    postStudyCongrats.style.display = "block";
    questionElement.textContent =
      "Study complete. Thank you for participating!";
    optionsElement.innerHTML = "";
    chartPlaceholder.innerHTML = "";
    submitButton.style.display = "none";
  }
}



async function claimUserID() {
  try {
    //Fetch userId from the server when starting the survey
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

    prestudyNotif.style.display = "block";

    console.log("User Id: " + userId);
    claimUserIDButton.style.display = "none";
    beginPrestudyButton.style.display = "block";
  } catch (error) {
    console.error("Error claim user ID:", error);
  }
}

export async function beginPrestudy() {
  try {
    const response = await fetch("/fetch-prestudy-table", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });


    const data = await response.json();
    prestudyTableData = data;
    storePrestudyQuestionsInArray();


  } catch (error) {
    console.error("Error starting the study:", error);
  }
}


const optionAClicked = () => {
  optionA.checked = !optionA.checked;
  if(optionA.checked){
    optionAContainer.style.backgroundColor = "#d1ffbd"
    optionBContainer.style.backgroundColor = "#ffffff"
  } else{
    optionAContainer.style.backgroundColor = "#ffffff"

  }
  optionB.checked = false;

  
}

const optionBClicked = () => {
  optionB.checked = !optionB.checked;
  if(optionB.checked){
    optionBContainer.style.backgroundColor = "#d1ffbd"
    optionAContainer.style.backgroundColor = "#ffffff"
  }else{
    optionBContainer.style.backgroundColor = "#ffffff"

  }
  optionA.checked = false;


}

// Batch D: Englishh Article: Mono esp, Multi Interleaved

const generateBatchD = (current) => {
  // Column A
  for(let i = 0; i < 6; i++){
    for(let z = 0; z < 2; z++ ){
      let new_elem = document.createElement("li")
      let val = data2DArray[current][3][1][i][z]
      if(z == 0){
        new_elem.style.fontWeight = "bold";
        new_elem.classList = "rec-title"
      } else{
      new_elem.classList = "rec-desc"
      new_elem.style.paddingBottom = "20px"
      }
      new_elem.textContent = data2DArray[currentQuestionIndex][3][z]
      optionAList.appendChild(new_elem)
      optionAContainer.addEventListener("click", optionAClicked)
      
    }
  }

  // Column B
  let eng_esp_counter = 0
  // TODO: Change this so it includes more reccommendations, start index at 0
  for(let j = 3; j < 6; j++) {
    for(let p = 0; p < 2; p++ ){
      let new_elem = document.createElement("li")
      
      if (eng_esp_counter == 0){
        eng_esp_counter = 1
        val = data2DArray[current][3][eng_esp_counter][j][p]
      }
      else{
        eng_esp_counter = 0
        val = data2DArray[current][3][eng_esp_counter][j][p]
      }
      if(p == 0){
        new_elem.style.fontWeight = "bold"
        new_elem.classList = "rec-title"

      }
      else{
        new_elem.classList = "rec-desc"
      new_elem.style.paddingBottom = "20px"


      }
      new_elem.textContent = val
      optionBList.appendChild(new_elem)
      eng_esp_counter += 1
      optionBContainer.addEventListener("click", optionBClicked)
    }
  }
}


const generateBatchC = (current) => {
  for(let i = 0; i < 6; i++){
    for(let z = 0; z < 2; z++ ){
      let new_elem = document.createElement("li")
      let val = data2DArray[current][3][1][i][z]
      if(z == 0){
        new_elem.style.fontWeight = "bold";
        new_elem.classList = "rec-title"
      } else{
      new_elem.classList = "rec-desc"
      new_elem.style.paddingBottom = "20px"
      }
   
      new_elem.textContent = val
      optionAList.appendChild(new_elem)
      optionAContainer.addEventListener("click", optionAClicked)
      
    }
  }

  //Interleaved, so try to get both a and b
  let eng_esp_counter = 0
  for(let j = 0; j < 6; j++) {
    
    for(let p = 0; p < 2; p++ ){
      let new_elem = document.createElement("li")
      let val

      val = data2DArray[current][3][eng_esp_counter][j][p]
      
      console.log(val)
      if(p == 0){
        new_elem.style.fontWeight = "bold"
        new_elem.classList = "rec-title"
      }
      else{
        new_elem.classList = "rec-desc"
        new_elem.style.paddingBottom = "20px"
      }

      new_elem.textContent = val
      optionBList.appendChild(new_elem)
      optionBContainer.addEventListener("click", optionBClicked)
    }
    if (eng_esp_counter == 0){
      eng_esp_counter = 1
    }
    else{
      eng_esp_counter = 0
    }
    // eng_esp_counter += 1
  }
}

// [question][texts][eng/spanish][title and desc]
// Esp article, mono spanish, multilingual block
const generateBatchB = (current) => {
  for(let i = 0; i < 6; i++){
    for(let z = 0; z < 2; z++ ){
      let new_elem = document.createElement("li")
      let val = data2DArray[current][3][1][i][z]
      if(z == 0){
        new_elem.style.fontWeight = "bold";
        new_elem.classList = "rec-title"
      } else{
        new_elem.classList = "rec-desc"
        new_elem.style.paddingBottom = "20px"
      }
   
      new_elem.textContent = val
      optionAList.appendChild(new_elem)
      optionAContainer.addEventListener("click", optionAClicked)
      
    }
  }

  for(let j = 0; j < 6; j++) {
    for(let p = 0; p < 2; p++ ){
      let new_elem = document.createElement("li")
      let val
      // Eng block
      if (j < 3){
        val = data2DArray[current][3][0][j][p]
      } else {
        val = data2DArray[current][3][1][j][p] 
      }

      new_elem.textContent = val
      if(p == 0){
        new_elem.style.fontWeight = "bold"
        new_elem.classList = "rec-title"

      }
      else{
        new_elem.classList = "rec-desc"
        new_elem.style.paddingBottom = "20px"

      }

      optionBList.appendChild(new_elem)
      optionBContainer.addEventListener("click", optionBClicked)
    }
  }
}

const generateBatchA = (current) =>{

// Option A
  for(let i = 0; i < 6; i++){
    for(let z = 0; z < 2; z++ ){
      let new_elem = document.createElement("li")
      let val = data2DArray[current][3][0][i][z]
      if(z == 0){
        new_elem.style.fontWeight = "bold";
        new_elem.classList = "rec-title"
      } else{
      new_elem.classList = "rec-desc"
      new_elem.style.paddingBottom = "20px"
      }
   

      new_elem.textContent = val
      optionAList.appendChild(new_elem)
      optionAContainer.addEventListener("click", optionAClicked)
      
    }

    
  }


  // Option B
  for(let j = 0; j < 6; j++) {
    for(let p = 0; p < 2; p++ ){
      let new_elem = document.createElement("li")
      let val
      // Eng block
      if (j < 3){
        val = data2DArray[current][3][0][j][p]
      } else {
        val = data2DArray[current][3][1][j][p] 
      }

      new_elem.textContent = val
      if(p == 0){
        new_elem.style.fontWeight = "bold"
        new_elem.classList = "rec-title"
      }
      else{
        new_elem.classList = "rec-desc"
        new_elem.style.paddingBottom = "20px"
      }


      optionBList.appendChild(new_elem)
      optionBContainer.addEventListener("click", optionBClicked)
    
  }
}
}

function storePrestudyQuestionsInArray() {
  for (const entry of prestudyTableData.data) {
    const questionText = entry.question_text;
    const options = entry.options;
    const correctAnswer = entry.correct_answer;
    const questionID = entry.question_id;

    //temp array with extracted data
    const rowArray = [
      questionText,
      options,
      correctAnswer,
      questionID,
    ];

    prestudyData2DArray.push(rowArray); //store all fetched data from table_questions into local 2d array data2DArray

  }
}
//Start the main study
export async function beginMainStudy() {
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
    studyContent.style.display = "flex"; // Show the study content
    beginMainStudyButton.style.display = "none";

    displayQuestion(); //display main study question
  } catch (error) {
    console.error("Error starting the study:", error);
  }
}




function storeQuestionsInArray() {
  for (const entry of tableData.data) {
    const category = entry.category;
    const note = entry.note;
    const article_images = entry.article_images;
    const options = entry.options;
    const questionID = entry.question_id;

    //temp array with extracted data
    const rowArray = [
      category,
      note,
      article_images,
      options,
      questionID
    ];

    data2DArray.push(rowArray); //store all fetched data from table_questions into local 2d array data2DArray
  }
}

const clearList = () => {
  optionAList.innerHTML = ""
  optionBList.innerHTML = ""
}

// Function to check the answer and proceed to the next question
async function checkAnswer() {
  let selectedOption = (currentAnswer.value = document.querySelector(
    'input[name="answer"]:checked'
  ).value);

  console.log(selectedOption);

  if (!selectedOption) {
    alert("Please select an answer.");
    return;
  }

  try {
    const responseSubmit = await fetch("/submit-response", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        userAnswer: selectedOption,
        questionNumber: currentQuestionId + 1,
        question: currentQuestion.value.substring(0, 100),
        isCorrect: selectedOption === currentCorrectAnswer,
      }),
    });

    const dataSubmit = await responseSubmit.json();
    console.log("Server response:", dataSubmit);

    currentQuestionIndex++;
    clearList();
    clearImage();
    displayQuestion();
    

  } catch (error) {
    console.error("Error submitting response:", error);
  }
}

const clearImage = () => {
  let img = document.getElementById("actual-image")
  imagePlaceholder.removeChild(img)
}

// Add event listeners
submitButton.addEventListener("click", () => {
  checkAnswer();

  recordInteraction("Submit", true, false);
});

beginPrestudyButton.addEventListener("click", () => {
  recordInteraction("Begin Prestudy", false, false);
  homeContent.style.display = "none";
  // prestudyquestions here must be populated right
  beginPrestudy()
  console.log("after button length is" + prestudyData2DArray.length)

  displayPrestudyQuestions(prestudyData2DArray);
});

claimUserIDButton.addEventListener("click", () => {
  claimUserID();
});

beginStudyButton.addEventListener("click", () => {
  recordInteraction("Begin Study", false, false);
  homeContent.style.display = "block";
  beginStudyButton.style.display = "none";
});

beginMainStudyButton.addEventListener("click", () => {
  recordInteraction("Begin Main Study", false, false);
  beginMainStudy();
});

// Initially, show the welcome message and hide the study content
homeContent.style.display = "none";
studyContent.style.display = "none";
prestudyContent.style.display = "none";
