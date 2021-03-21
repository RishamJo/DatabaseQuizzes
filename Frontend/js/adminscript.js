const createButton = document.getElementById('quizCreate');
const body = document.getElementsByTagName('body').item(0);

let quizzes = [];

function getQuizzes(){
    //Reset quizzes array.
    quizzes = [];
    if(document.getElementById('quizList')){
        document.getElementById('quizList').remove();
    }

    let quizList = document.createElement('div');
    quizList.setAttribute('id','quizList');
    //Send AJAX request to get Quizzes.
    const xmlGetQuiz = new XMLHttpRequest();
    xmlGetQuiz.open('GET', 'http://localhost:8888/admin/quizzes', true);
    xmlGetQuiz.send();
    xmlGetQuiz.onreadystatechange = function(){
        if((this.readyState==4)&&(this.status==200)){
            //Parse JSON into an object.
            let response = JSON.parse(this.responseText);
            
            //If the object is empty, indicate on the page.
            if(response.length === 0){
                let noQuizText = document.createElement('h2');
                noQuizText.appendChild(document.createTextNode('No quizzes available'));
                noQuizText.setAttribute('id','noQuizText');
                quizList.appendChild(noQuizText);
            } else {
                //For each item in the object
                response.forEach((row)=>{
                    //Create a new quiz object and store it in the global array.
                    let quiz = new Quiz(row.quizNum, row.quizName, row.numQuestions);
                    quizzes.push(quiz);
                    quizList.appendChild(quiz.display());
                });
            }
            body.insertBefore(quizList, createButton);
        }
    }
}

function createQuiz(){
    //If there are zero quizzes, remove the banner text saying so.
    if(document.getElementById('noQuizText')){
        document.getElementById('noQuizText').remove();
    }

    //Create a new form element.
    let quizForm = document.createElement('form');

    //Create a new input element of type text.
    let quizTitle = document.createElement('input');
    quizTitle.setAttribute('type','text');
    quizTitle.setAttribute('placeholder', 'New Quiz Title');
    quizTitle.setAttribute('name','title');
    quizForm.appendChild(quizTitle);

    //Create a submit button for the form.
    let quizSubmit = document.createElement('input');
    quizSubmit.setAttribute('type','submit');
    quizForm.appendChild(quizSubmit);

    //Create a custom handler for the submit button.
    quizForm.addEventListener('submit', (event) => {
        event.preventDefault();

        //Send an AJAX post with the form data.
        let sendQuiz = new XMLHttpRequest();
        let quizData = 'title='+quizTitle.value;
        sendQuiz.open('POST', 'http://localhost:8888/admin/quizzes', true);
        sendQuiz.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
        sendQuiz.send(quizData);
        sendQuiz.onreadystatechange = function() {
            if((this.readyState==4)&&(this.status==200)){
                //Re-show the quizzes when the post is done.
                getQuizzes();
            }
        }
    });

    body.prepend(quizForm);
}

window.onload = getQuizzes;
document.getElementById('quizCreate').onclick = createQuiz;