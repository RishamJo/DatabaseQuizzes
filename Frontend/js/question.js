function Question(questionNum, quizNum, questionText) {
    this.questionNum = questionNum;
    this.quizNum = quizNum;
    this.questionText = questionText;
    this.answers = [];

    this.display = () => {
        let questionContainer = document.createElement('div');
        questionContainer.setAttribute('id', 'quiz' + quizNum + 'q' + questionNum);

        if (document.getElementById('quiz' + quizNum + 'q' + questionNum)) {
            document.getElementById('quiz' + quizNum + 'q' + questionNum).remove();
        }

        let questionContent = document.createElement('p');
        let questionTextNode = document.createTextNode(questionNum + '. ' + questionText);
        questionContent.appendChild(questionTextNode);
        questionContainer.appendChild(questionContent);

        //Create a new form element.
        let editForm = document.createElement('form');

        //Create a new input element of type text.
        let editText = document.createElement('input');
        editText.setAttribute('type', 'textarea');
        editText.setAttribute('placeholder', 'Editted Question');
        editText.setAttribute('name', 'title');
        editForm.appendChild(editText);

        //Create a submit button for the form.
        let editSubmit = document.createElement('input');
        editSubmit.setAttribute('type', 'submit');
        editForm.appendChild(editSubmit);

        editForm.addEventListener('submit', (event)=>{
            event.preventDefault();

            let sendEdit = new XMLHttpRequest();
            let editData = 'editText=' + editText.value + '&quizNum=' + this.quizNum + '&q=' + this.questionNum;
            sendEdit.open('PUT', 'http://localhost:8888/admin/questions', true);
            sendEdit.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            sendEdit.send(editData);
            sendEdit.onreadystatechange = ()=>{
                if ((this.readyState == 4) && (this.status == 200)) {
                    questionTextNode.textContent = editText.value;
                }
            }
        });

        questionContent.appendChild(editForm);


        //Create a new form element.
        let answerForm = document.createElement('form');

        //Create a new input element of type text.
        let newAnswerText = document.createElement('input');
        newAnswerText.setAttribute('type', 'textarea');
        newAnswerText.setAttribute('placeholder', 'New Answer');
        newAnswerText.setAttribute('name', 'title');
        answerForm.appendChild(newAnswerText);

        //Create a submit button for the form.
        let answerSubmit = document.createElement('input');
        answerSubmit.setAttribute('type', 'submit');
        answerForm.appendChild(answerSubmit);

        let answerCorrect = document.createElement('input');
        answerCorrect.setAttribute('type', 'checkbox');
        answerCorrect.setAttribute('name', 'isCorrect');
        answerForm.appendChild(answerCorrect);

        let correctLabel = document.createElement('label');
        correctLabel.setAttribute('for', 'isCorrect');
        correctLabel.appendChild(document.createTextNode('Answer is correct?'));
        answerForm.appendChild(correctLabel);

        //Create a custom handler for the submit button.
        answerForm.addEventListener('submit', (event) => {
            event.preventDefault();

            //Send an AJAX post with the form data.
            let sendAnswer = new XMLHttpRequest();
            let callback = this.getAnswers;

            let correct = answerCorrect.checked ? 'T' : 'F';
            let quizData = 'answerText=' + newAnswerText.value + '&quizNum=' + this.quizNum + '&q=' + this.questionNum + '&correct=' + correct;
            sendAnswer.open('POST', 'http://localhost:8888/admin/answers', true);
            sendAnswer.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            sendAnswer.send(quizData);
            sendAnswer.onreadystatechange = function () {
                if ((this.readyState == 4) && (this.status == 200)) {
                    callback(questionContent);
                }
            }

            answerCorrect.checked = false;
        });

        questionContent.appendChild(answerForm);

        if (this.answers.length === 0) {
            this.getAnswers(questionContent);
        }

        return questionContainer;
    }

    this.getAnswers = (contentDiv) => {
        //Send AJAX request to get Questions.
        this.answers = [];
        let answerArray = this.answers;
        const xmlGetAnswers = new XMLHttpRequest();
        xmlGetAnswers.open('GET', 'http://localhost:8888/admin/quizzes/answers?quiz=' + this.quizNum + '&q=' + this.questionNum, true);
        xmlGetAnswers.send();
        xmlGetAnswers.onreadystatechange = function () {
            if ((this.readyState == 4) && (this.status == 200)) {
                //Parse JSON into an object.
                let response = JSON.parse(this.responseText);
                console.log('Get answers', response);
                response.forEach(row => {
                    let answer = new Answer(row.answerNum, row.questionNum, row.quizNum, row.answerText, (row.correct === 'T'));
                    answerArray.push(answer);
                    contentDiv.appendChild(answer.display());
                });

                //If there are no questions, indicate it to the user.
                if (answerArray.length === 0) {
                    let emptyText = document.createElement('p');
                    emptyText.appendChild(document.createTextNode('No answers for the question.'))
                    contentDiv.appendChild(emptyText);
                }
            }
        }
    }
}