const root = "https://pure-anchorage-93427.herokuapp.com/"
let questionList = [];

function parseDBQuestions(response) {
  let current = -1;
  let question = {};
  let choice = {};
  let result = [];

  for (let i = 0; i < response.length; i++) {
    if (response[i].questionID !== current) {
      if (question.questionID) {
        result.push(question);
      }
      
      question = {};
      question.questionID = response[i].questionID;
      question.questionText = response[i].questionText;
      question.numChoices = response[i].numChoices;
      question.answer = response[i].answerText;

      choice = {};
      choice.choiceID = response[i].choiceID;
      choice.choiceText = response[i].choiceText;
      question.choices = [choice];
    } else {
      choice = {};
      choice.choiceID = response[i].choiceID;
      choice.choiceText = response[i].choiceText;
      question.choices.push(choice);
    }
    current = response[i].questionID;
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
    let response = xhttp.response;
    questionsObj = response
    questionList = parseDBQuestions(response);
    if (questionList[0].questionID) {
      questionID = questionList.length + 1;
    }
    renderQuestions(questionList);
  };
}