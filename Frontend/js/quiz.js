

function Quiz(quizNum, quizName) {
    this.quizNum = quizNum;
    this.quizName = quizName;
    this.questions = [];

    this.display = () => {
        //Create a container for the title and the content.
        let quizContainer = document.createElement('div');

        //Create a title and the handler for clicking on it.
        let quizTitle = document.createElement('div');
        quizTitle.appendChild(document.createTextNode(this.quizNum + '. ' + this.quizName));
        quizTitle.setAttribute('class', 'button blue-button');
        quizTitle.addEventListener('click', () => {

            //Check if the content is already visible. If so, remove it on click.
            if (document.getElementById('quiz' + this.quizNum)) {
                document.getElementById('quiz' + this.quizNum).remove();
                return;
            }

            //Create a div for quiz content that is separate from the title div.
            let quizContent = document.createElement('div');
            quizContent.setAttribute('id', 'quiz' + quizNum);

            //Check for new questions.
            this.getQuestions(quizContent);

            //Create a new form element.
            let questionForm = document.createElement('form');

            //Create a new input element of type text.
            let newQuestionText = document.createElement('input');
            newQuestionText.setAttribute('type', 'textarea');
            newQuestionText.setAttribute('placeholder', 'New Question');
            newQuestionText.setAttribute('name', 'title');
            questionForm.appendChild(newQuestionText);

            //Create a submit button for the form.
            let questionSubmit = document.createElement('input');
            questionSubmit.setAttribute('type', 'submit');
            questionForm.appendChild(questionSubmit);

            //Create a custom handler for the submit button.
            questionForm.addEventListener('submit', (event) => {
                event.preventDefault();

                //Send an AJAX post with the form data.
                let sendQuestion = new XMLHttpRequest();
                let callback = this.getQuestions;
                let quizData = 'questionText=' + newQuestionText.value + '&quizNum=' + this.quizNum;
                sendQuestion.open('POST', 'http://localhost:8888/admin/questions', true);
                sendQuestion.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                sendQuestion.send(quizData);
                sendQuestion.onreadystatechange = function () {
                    if ((this.readyState == 4) && (this.status == 200)) {
                        callback(quizContent);
                    }
                }
            });
            quizContainer.appendChild(quizContent);
            quizContent.appendChild(questionForm);
        });

        quizContainer.appendChild(quizTitle);

        return quizContainer;
    }

    this.getQuestions = (contentDiv) => {
        //Send AJAX request to get Questions.
        this.questions = [];
        let questionsArray = this.questions;
        const xmlGetQuestions = new XMLHttpRequest();
        xmlGetQuestions.open('GET', 'http://localhost:8888/admin/quizzes/questions?quiz=' + this.quizNum, true);
        xmlGetQuestions.send();
        xmlGetQuestions.onreadystatechange = function () {
            if ((this.readyState == 4) && (this.status == 200)) {
                //Parse JSON into an object.
                let response = JSON.parse(this.responseText);
                response.forEach(row => {
                    let question = new Question(row.questionNum, row.quizNum, row.questionText);
                    questionsArray.push(question);
                    contentDiv.appendChild(question.display());
                });

                //If there are no questions, indicate it to the user.
                if (questionsArray.length === 0) {
                    let emptyText = document.createElement('h2');
                    emptyText.appendChild(document.createTextNode('No questions in the quiz.'))
                    contentDiv.appendChild(emptyText);
                }
            }
        }
    }
}