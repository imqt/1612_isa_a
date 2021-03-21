const noQuestionsMsg = "No questions in this quiz.";

document.addEventListener("DOMContentLoaded", () => {
  getDBQuestions();
  let questionsForm = document.getElementById("questionsForm");
  addSubmitHandler(questionsForm);
});

function addSubmitHandler(form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    processQuiz();
  });
}

function renderQuestions(questionList) {
  if (questionList[0].questionID) {
    let form = document.getElementById("questionsForm");
    for (let i = 0; i < questionList.length; i++) {

      let div = document.createElement("div");
      div.setAttribute("id", "question" + questionList[i].questionID);
      div.setAttribute("class", "qHeader container");
      div.innerHTML = questionList[i].questionID + ")";
      let prompt = document.createElement("div");
      prompt.setAttribute("id", "questionPrompt" + questionList[i].questionID);
      prompt.setAttribute("class", "prompt");
      prompt.innerHTML = questionList[i].questionText;
      div.appendChild(prompt);

      for (let j = 0; j < questionList[i].choices.length; j++) {
        let ul = document.createElement("ul");
        ul.setAttribute("class", "choiceList");

        let liElement = document.createElement("li");
        liElement.setAttribute("class", "choiceElement");

        let radio = document.createElement("input");
        radio.setAttribute("type", "radio");
        radio.setAttribute(
          "id",
          "question" + questionList[i].questionID + "radio" + (j + 1)
        );
        radio.setAttribute(
          "class",
          "choiceRadio question" + questionList[i].questionID + "radios"
        );
        radio.setAttribute("name", "radio" + questionList[i].questionID);
        radio.setAttribute("required", "required");
        liElement.appendChild(radio);

        let input = document.createElement("span");
        input.setAttribute(
          "id",
          "question" + questionList[i].questionID + "input" + (j + 1)
        );
        input.setAttribute(
          "class",
          "choiceInput question" + questionList[i].questionID + "inputs"
        );
        input.innerHTML = questionList[i].choices[j].choiceText;
        liElement.appendChild(input);

        let choiceID = document.createElement("input");
        choiceID.setAttribute("id", questionList[i].choices[j].choiceID);
        choiceID.setAttribute(
          "class",
          "question" + questionList[i].questionID + "choiceIDs"
        );
        choiceID.setAttribute("type", "hidden");
        choiceID.value = questionList[i].choices[j].choiceID;
        liElement.appendChild(choiceID);
        ul.appendChild(liElement);
        div.appendChild(ul);
      }
      form.appendChild(div);
    }

    let submitBtn = document.createElement("button");
    submitBtn.setAttribute("type", "submit");
    submitBtn.setAttribute("id", "submitBtn");
    submitBtn.innerHTML = "Submit";
    form.appendChild(submitBtn);
    document.getElementById("quizContainer").appendChild(form);

  } else {
    document.getElementById("noQuestions").innerHTML = noQuestionsMsg;
  }
}

function processQuiz() {
  
  let score = 0;
  let studentChoice = "";

  for (let i = 0; i < questionList.length; i++) {
    for (let j = 0; j < questionList[i].choices.length; j++) {
      if (
        document.getElementById("question" + (i + 1) + "radio" + (j + 1))
          .checked
      ) {
        studentChoice = document.getElementById(
          "question" + (i + 1) + "input" + (j + 1)
        );
        if (questionList[i].answer === studentChoice.innerHTML) {
          score++;
          studentChoice.classList.add("correct");
        } else {
          studentChoice.classList.add("incorrect");
        }
      }
    }
  }

  let finalScore = document.getElementById("finalScore");
  finalScore.innerHTML = `Your score: ${score} / ${questionList.length}`;
  finalScore.hidden = false;
  document.getElementById("submitBtn").disabled = true;
}
