const GET = 'GET';
const POST = 'POST';
const PUT = 'PUT';
let http = require('http');
let url = require('url');
const mysql = require('mysql');

const db_config = {
  host: "us-cdbr-east-03.cleardb.com",
  user: "beb36f7c95492f",
  password: "acbf7750",
  database: "heroku_9c7655f8e822914",
  multipleStatements: true,
}

let con = mysql.createConnection(db_config);

con.connect((err) => {
  if (err) throw err;
  console.log("Connected");
});

let server = http.createServer((req, res) => {
  let q = url.parse(req.url, true);
  res.writeHead(200, {
    "Content-Type": "text/html",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*"
  });

  const createQuestion = [
    'CREATE TABLE IF NOT EXISTS question',
      '(questionID INT NOT NULL PRIMARY KEY,',
      'questionText VARCHAR (100) DEFAULT NULL,',
      'numChoices INT NOT NULL)'
  ].join(' ');

  con.query(createQuestion, (err, result) => {
    if (err) throw err;
  });

  const createChoice = [
    'CREATE TABLE IF NOT EXISTS choice',
      '(choiceID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
      'questionID INT NOT NULL,',
      'choiceText VARCHAR (100) DEFAULT NULL)'
  ].join(' ');

  con.query(createChoice, (err, result) => {
    if (err) throw err;
  });

  const createAnswer = [
    'CREATE TABLE IF NOT EXISTS answer',
      '(answerID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,',
      'questionID INT NOT NULL,',
      'answerText VARCHAR (100) DEFAULT NULL)'
  ].join(' ');

  if (req.method === 'OPTIONS' && q.pathname === "/questions") {
    res.end();
  }

  con.query(createAnswer, (err, result) => {
    if (err) throw err;
  });

  if (req.url !== '/favicon.ico') {
    req.on('error', (err) => {
      console.error(err.stack);
    });
  
    if (req.method === GET && q.pathname === '/questions') {
      console.log("GET");
      let sql = "SELECT * FROM question JOIN choice ON question.questionID = choice.questionID JOIN answer ON choice.questionID = answer.questionID ORDER BY question.questionID ASC;";
      con.query(sql, (err, result) => {
        if (err) throw err;
        res.end(JSON.stringify(result));
      });
    } else if (req.method === POST && q.pathname === '/questions') {
      console.log("POST");
      req.on('data', data => {
        let questionData = JSON.parse(data);
        let qText = questionData.questionText;
        let addQuestion = "INSERT INTO question(questionID, questionText, numChoices) VALUES (" 
          + questionData.questionID + ", " 
          + con.escape(qText) + ", " 
          + questionData.numChoices + ");";
        con.query(addQuestion, (err, result) => {
          if (err) throw err;
        });
    
        for (let i = 0; i < questionData.choices.length; i++) {
          let cText = questionData.choices[i].choiceText;
          let addChoice = "INSERT INTO choice(questionID, choiceText) VALUES ("
            + questionData.questionID + ", "
            + con.escape(cText)  + ");";
    
          con.query(addChoice, (err, result) => {
            if (err) throw err;
          });
        }
    
        let aText = questionData.answer;
        let addAnswer = "INSERT INTO answer(questionID, answerText) VALUES ("
          + questionData.questionID + ", "
          + con.escape(aText) + ");";
        
        con.query(addAnswer, (err, result) => {
          if (err) throw err;
        });
      });
    } else if (req.method === PUT && q.pathname === '/questions') {
      console.log("PUT");
      req.on('data', data => {
        let questionData = JSON.parse(data);
        let qText = questionData.questionText;
        let updateQuestion = "UPDATE question SET " 
          + "questionID=" + questionData.questionID + ", " 
          + "questionText=" + con.escape(qText) + ", " 
          + "numChoices=" + questionData.numChoices
          + " WHERE questionID=" + questionData.questionID + ";";
        con.query(updateQuestion, (err, result) => {
          if (err) throw err;
        });
  
        for (let i = 0; i < questionData.choices.length; i++) {
          let cText = questionData.choices[i].choiceText;
          let updateChoice = "UPDATE choice SET "
            + "questionID=" + questionData.questionID + ", "
            + "choiceText=" + con.escape(cText)
            + " WHERE choiceID=" + questionData.choices[i].choiceID
            + ";";
          
          con.query(updateChoice, (err, result) => {
            if (err) throw err;
          });
        }
  
        let aText = questionData.answer;
        let updateAnswer = "UPDATE answer SET "
          + "questionID=" + questionData.questionID + ", "
          + "answerText=" + con.escape(aText) 
          + " WHERE questionID=" + questionData.questionID + ";";
        
        con.query(updateAnswer, (err, result) => {
          if (err) throw err;
        });
      });
    }
  }
  con.on('error', (err) => {
    if (err.code === "PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR" 
      || err.code === 'PROTOCOL_CONNECTION_LOST') {
      con.end((err) => {
        console.log(err);
      });
      con = mysql.createConnection(db_config);                  
    } else {                                     
      throw err;                                
    }
  });
});

server.listen(process.env.PORT || 3000);
// server.listen(3000);
