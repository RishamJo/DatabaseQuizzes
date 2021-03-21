const answerCount = 4;
const questionCount = Number.parseInt(localStorage.getItem("question_count"));
const questions = [];
getQuestions();

function MPQuestion(question, correct, questionNum) {
    this.question = question;
    this.correct = correct;
    this.questionNum = questionNum;
    this.displayQuestion = function () {
        let elements = [];
        let questionText = document.createElement("h2");
        questionText.innerHTML = question;
        elements.push(questionText);
        for (let i = 0; i < answerCount; i++) {
            let answerContainer = document.createElement("div");
            answerContainer.setAttribute("class", "q" + questionNum);
            //Create and set radio button
            let answerRadio = document.createElement("input");
            answerRadio.setAttribute("type", "radio");
            answerRadio.setAttribute("name", "q" + questionNum);
            answerRadio.setAttribute("value", i);
            //Create and set radio button label
            let answerLabel = document.createElement("label");
            let answer = localStorage.getItem("question" + questionNum + "_possible_answer" + i);
            answerLabel.setAttribute("for", i);
            answerLabel.innerHTML = answer;

            answerContainer.appendChild(answerRadio);
            answerContainer.appendChild(answerLabel);
            //Add radio button and label to array
            elements.push(answerContainer);
        }
        return elements;
    }
}

function getQuestions() {
    for (let i = 0; i < questionCount; i++) {
        let question = localStorage.getItem("question" + i);
        let correct = localStorage.getItem("question" + i + "_right_answer");
        let correctNum = Number.parseInt(correct);
        questions.push(new MPQuestion(question, correctNum, i));
    }
}

function checkQuiz(event) {
    event.preventDefault();
    let previousResult = document.getElementsByClassName("fix");
    console.log(previousResult);
    if (previousResult.length != 0)
        while (previousResult.length > 0) {
            previousResult[0].classList.remove("fix");
        }

    previousResult = document.getElementsByClassName("wrong");
    if (previousResult.length != 0)
        while (previousResult.length > 0) {
            previousResult[0].classList.remove("wrong");
        }

    previousResult = document.getElementsByClassName("correct");
    if (previousResult.length != 0)
        while (previousResult.length > 0) {
            previousResult[0].classList.remove("correct");
        }

    let score = 0;
    for (let i = 0; i < questionCount; i++) {
        let selected = document.querySelector('input[name="q' + i + '"]:checked');
        if (selected.value == questions[i].correct) {
            selected.parentElement.setAttribute("class", "q" + i + " correct");
            score++;
        } else {
            let correction = document.getElementsByClassName('q' + i);
            selected.parentElement.setAttribute("class", "q" + i + " wrong");
            correction[questions[i].correct].setAttribute("class", "q" + i + " fix");
        }
    }

    let scoreDisplay = document.getElementById("score");
    if (scoreDisplay == null) {
        scoreDisplay = document.createElement('h3');
        scoreDisplay.setAttribute("id", "score");
        document.querySelector('form').insertBefore(scoreDisplay, document.getElementById("finish"));
    }
    scoreDisplay.innerHTML = "Your quiz score is " + score + "/" + questionCount + ".";
}

if (typeof (Storage) == "undefined") {
    //not supported
    document.write("Sorry web storage is not supported on your browser");
    window.stop();
} else {
    if (questionCount <= 0) {
        document.write("No quiz found.");
    } else {
        let form = document.createElement("form");
        document.body.insertBefore(form, document.getElementById("back"));
        questions.forEach(question => {
            let questionElements = question.displayQuestion();
            questionElements.forEach(quizElement => {
                form.appendChild(quizElement);
            });
        });
        let submitButton = document.createElement("input");
        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("class", "button");
        submitButton.setAttribute("id", "finish");
        submitButton.addEventListener('click', checkQuiz);
        form.appendChild(submitButton);
    }
}
