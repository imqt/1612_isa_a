const root = "http://localhost:3000"
let questionList = [];

function parseDBQuestions(res) {
  let result = [];
  let question = {};
  let choice = {};
  let current = -1;

  for (let i = 0; i < res.length; i++) {
    if (res[i].questionID !== current) {
      if (question.questionID) {
        result.push(question);
      }
      question = {};
      question.questionID = res[i].questionID;
      question.questionText = res[i].questionText;
      question.numChoices = res[i].numChoices;
      question.answer = res[i].answerText;
      choice = {};
      choice.choiceID = res[i].choiceID;
      choice.choiceText = res[i].choiceText;
      question.choices = [choice];
    } else {
      choice = {};
      choice.choiceID = res[i].choiceID;
      choice.choiceText = res[i].choiceText;
      question.choices.push(choice);
    }
    current = res[i].questionID;
  }
  result.push(question);
  return result;
}

function getDBQuestions() {
  const xhttp = new XMLHttpRequest();
  xhttp.open("GET", root + "questions", true);
  xhttp.responseType = "json";
  xhttp.send();
  xhttp.onload = function() {
    let res = xhttp.response;
    questionsObj = res
    questionList = parseDBQuestions(res);
    if (questionList[0].questionID) {
      questionID = questionList.length + 1;
    }
    renderQuestions(questionList);
  };
}