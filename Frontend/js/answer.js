function Answer(answerNum, questionNum, quizNum, answerText, correct) {
    this.answerNum = answerNum;
    this.questionNum = questionNum;
    this.quizNum = quizNum;
    this.answerText = answerText;
    this.correct = correct;

    this.display = () => {
        if (document.getElementById('quiz'+this.quizNum+'q'+this.questionNum+'a'+this.answerNum)) {
            document.getElementById('quiz'+this.quizNum+'q'+this.questionNum+'a'+this.answerNum).remove();
        }

        let answerDiv = document.createElement('div');
        answerDiv.setAttribute('id', 'quiz'+this.quizNum+'q'+this.questionNum+'a'+this.answerNum);

        //Create answer radio button.
        let answerInput = document.createElement('input');
        answerInput.setAttribute('type', 'radio');
        answerInput.setAttribute('value', 'quiz' + this.quizNum + 'q' + this.questionNum + 'a' + this.answerNum);
        answerInput.setAttribute('name', 'quiz' + this.quizNum + 'q' + this.questionNum);

        //Create answer label.
        let answerLabel = document.createElement('label');
        answerLabel.setAttribute('for', 'quiz' + this.quizNum + 'q' + this.questionNum + 'a' + this.answerNum);
        answerLabel.appendChild(document.createTextNode(answerText));

        answerDiv.appendChild(answerInput);
        answerDiv.appendChild(answerLabel);
        return answerDiv;
    }
}