const choiceLimitMsg = "4 is the maximum number of choices!";
let questionID = 1;
let newQuestionChoices = 2;

document.addEventListener("DOMContentLoaded", () => {
  getDBQuestions();
  
  let form = document.getElementById("newQuestionForm");
  addNewQuestionHandler(form);

  let addChoiceBtn = document.getElementById("addChoiceBtn");
  addChoiceHandler(addChoiceBtn);
});

function renderQuestions(questionList) {
  if (questionList[0].questionID) {
    document.getElementById("questions").innerHTML = "<h3>Existing Questions</h3>";
    for (let i = 0; i < questionList.length; i++) {

      let form = document.createElement('form');
      form.setAttribute("id", "form" + questionList[i].questionID);
  
      let div = document.createElement('div');
      div.setAttribute("id", "question" + questionList[i].questionID);
      div.setAttribute("class", "qHeader container");
      div.innerHTML = questionList[i].questionID + ")";

      let br = document.createElement("br");
      div.appendChild(br);
  
      let prompt = document.createElement('textarea');
      prompt.setAttribute("id", "questionPrompt" + questionList[i].questionID);
      prompt.setAttribute("class", "prompt");
      prompt.value = questionList[i].questionText;
      div.appendChild(prompt);
  
      for (let j = 0; j < questionList[i].choices.length; j++) {

        let ul = document.createElement('ul');
        ul.setAttribute("class", "choiceList");
  
        let liElement = document.createElement('li');
  
        let radio = document.createElement('input');
        radio.setAttribute("type", "radio");
        radio.setAttribute("id", "question" + questionList[i].questionID + "radio" + (j + 1));
        radio.setAttribute("class", "choiceRadio question" + questionList[i].questionID + "radios");
        radio.setAttribute("name", "radio" + questionList[i].questionID); 
        liElement.appendChild(radio);
  
        let input = document.createElement('input');
        input.setAttribute("id", "question" + questionList[i].questionID + "input" + (j + 1));
        input.setAttribute("class", "choiceInput question" + questionList[i].questionID + "inputs");
        input.value = questionList[i].choices[j].choiceText;
        liElement.appendChild(input);
  
        let choiceID = document.createElement('input');
        choiceID.setAttribute("id", questionList[i].choices[j].choiceID);
        choiceID.setAttribute("class", "question" + questionList[i].questionID + "choiceIDs");
        choiceID.setAttribute("type", "hidden");
        choiceID.value = questionList[i].choices[j].choiceID;
        liElement.appendChild(choiceID);
  
        if (questionList[i].choices[j].choiceText == questionList[i].answer) {
          radio.checked = true;
        }
  
        ul.appendChild(liElement);
        div.appendChild(ul);
      }

      let saveChangesBtn = document.createElement('button');
      saveChangesBtn.setAttribute("id", "saveChangesBtn");
      saveChangesBtn.setAttribute("type", "submit");
      saveChangesBtn.innerHTML = "Save Changes";
  
      div.appendChild(saveChangesBtn);
      form.appendChild(div);
      document.getElementById("questions").appendChild(form);
      addSubmitHandler(form, questionList[i].questionID);
    }
  }
}

function addNewQuestion() {
  let choices = [];
  let answer;
  let prompt = document.getElementById("newQuestionPrompt").value;
  let choiceRadios = document.getElementsByClassName("newQuestionChoiceRadio");
  let choiceInputs = document.getElementsByClassName("newQuestionChoiceInput");

  for (let i = 0; i < choiceInputs.length; i++) {
    let choice = {};
    choice.choiceText = choiceInputs[i].value;
    choices.push(choice);
    if (choiceRadios[i].checked) {
      answer = choiceInputs[i].value;
    }
  }

  let question = {
    questionID: questionID,
    questionText: prompt,
    choices: choices,
    numChoices: choices.length,
    answer: answer,
  };

  const xhttp = new XMLHttpRequest();
  xhttp.open("POST", root + "questions", true);
  xhttp.responseType = "json";
  xhttp.send(JSON.stringify(question));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("POST");
    }
  };
  getDBQuestions();
}

function addNewQuestionHandler(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewQuestion();
  });
}

function addSubmitHandler(form, questionID) {
  console.log("adding submit handler")
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    updateQuestion(questionID);
    console.log("updated")
  });
}

function addChoice() {

  let div = document.getElementById("newQuestionChoices");

  let radio = document.createElement("input");
  radio.setAttribute("type", "radio");
  radio.setAttribute("class", "newQuestionChoiceRadio");
  radio.setAttribute("name", "newQuestionRadio");
  radio.setAttribute("required", "required");

  let input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("class", "newQuestionChoiceInput");
  input.setAttribute("required", "required");

  let br = document.createElement("br");

  div.appendChild(radio);
  div.appendChild(input);
  div.appendChild(br);

  newQuestionChoices++;
}

function addChoiceHandler(button) {
  button.addEventListener("click", (e) => {
    if (newQuestionChoices >= 4) {
      document.getElementById("choiceLimit").innerHTML = choiceLimitMsg;
    } else {
      addChoice();
    }
  });
}

function updateQuestion(questionID) {
  console.log("updating")
  let choices = [];
  let answer;
  let prompt = document.getElementById("questionPrompt" + questionID).value;
  
  let choiceRadios = document.getElementsByClassName(
    "question" + questionID + "radios"
  );
  let choiceInputs = document.getElementsByClassName(
    "question" + questionID + "inputs"
  );
  let choiceIDs = document.getElementsByClassName(
    "question" + questionID + "choiceIDs"
  );

  for (let i = 0; i < choiceInputs.length; i++) {
    let choice = {};
    choice.choiceID = choiceIDs[i].value;
    choice.choiceText = choiceInputs[i].value;
    choices.push(choice);
    if (choiceRadios[i].checked) {
        answer = choiceInputs[i].value;
    }
  }

  let question = {
    "questionID": questionID,
    "questionText": prompt,
    "choices": choices,
    "numChoices": choices.length,
    "answer": answer,
  };

  const xhttp = new XMLHttpRequest();
  xhttp.open("PUT", root + "questions", true);
  xhttp.responseType = "json";
  xhttp.send(JSON.stringify(question));
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log("PUT");
    }
  };
}
