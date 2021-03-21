const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const mysql = require('mysql');
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "mysql123",
    database: "quizzes"
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/admin/quizzes', (req, res) => {
    db.query('SELECT * FROM quiz', (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        res.writeHead(
            200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.write(JSON.stringify(result));
        res.end();
    });
});

app.get('/admin/quizzes/questions', (req, res) => {
    db.query('SELECT * FROM questions WHERE quizNum = ' + req.query.quiz, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        res.writeHead(
            200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.write(JSON.stringify(result));
        res.end();
    });
});

app.get('/admin/quizzes/answers', (req, res) => {
    db.query('SELECT * FROM answers WHERE quizNum = ' + req.query.quiz + ' AND questionNum = ' + req.query.q, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        res.writeHead(
            200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.write(JSON.stringify(result));
        res.end();
    });
});

app.post('/admin/quizzes', (req, res) => {
    console.log(req.body.title);
    db.query('INSERT INTO quiz(quizName) VALUES("' + req.body.title + '")', (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        res.writeHead(
            200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.write(JSON.stringify(result));
        res.end();
    });
});

app.post('/admin/questions', (req, res) => {
    let questionNum;
    db.query('SELECT COUNT(quizNum) AS "Count" FROM questions WHERE quizNum = ' + req.body.quizNum, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        console.log(result[0].Count);
        questionNum = result[0].Count + 1;
        db.query('INSERT INTO questions VALUES(' + questionNum + ',' + req.body.quizNum + ',"' + req.body.questionText + '")', (err, result) => {
            if (err) {
                throw err;
            }
            res.writeHead(
                200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            );
            res.write("Got it");
            res.end();
        });
    });
});

app.post('/admin/answers', (req, res) => {
    let answerNum;
    db.query('SELECT COUNT(answerNum) AS "Count" FROM answers WHERE quizNum = ' + req.body.quizNum + ' AND questionNum = ' + req.body.q, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        answerNum = result[0].Count + 1;
        db.query('INSERT INTO answers VALUES(' + answerNum + ',' + req.body.q + ',' + req.body.quizNum + ',"' + req.body.answerText + '", "' + req.body.correct + '")', (err, result) => {
            if (err) {
                res.writeHead(500, {
                    'Content-Type': 'text/plain'
                });
                res.write("Internal error.");
                res.end();
                throw err;
            }
            res.writeHead(
                200, {
                    'Content-Type': 'text/plain',
                    'Access-Control-Allow-Origin': '*'
                }
            );
            res.write("Got it");
            res.end();
        });
    });
});

app.put('/admin/questions', (req, res) => {
    console.log(req.body);
    db.query('UPDATE questions SET questionText = ' + req.body.editText + ' WHERE quizNum = ' + req.body.quizNum + ' AND questionNum = ' + req.body.q, (err, result) => {
        if (err) {
            res.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            res.write("Internal error.");
            res.end();
            throw err;
        }
        res.writeHead(
            200, {
                'Content-Type': 'text/plain',
                'Access-Control-Allow-Origin': '*'
            }
        );
        res.write("Got it");
        res.end();
    });
});

app.get('/student/quizzes', (req, res) => {

});

app.get('/student/quizzes/questions', (req, res) => {

});

app.listen(8888);