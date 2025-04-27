// Вопросы для квиза
const questions = [
    {
        question: "Какой метод добавляет элемент в конец массива?",
        answers: [
            { text: "push()", correct: true },
            { text: "pop()", correct: false },
            { text: "shift()", correct: false },
            { text: "unshift()", correct: false }
        ]
    },
    {
        question: "Какой оператор используется для строгого сравнения?",
        answers: [
            { text: "==", correct: false },
            { text: "===", correct: true },
            { text: "=", correct: false },
            { text: "!=", correct: false }
        ]
    },
    {
        question: "Как объявить переменную с блочной областью видимости?",
        answers: [
            { text: "var", correct: false },
            { text: "let", correct: true },
            { text: "const", correct: true },
            { text: "variable", correct: false }
        ]
    }
];

// Элементы DOM
const startButton = document.getElementById('start-btn');
const nextButton = document.getElementById('next-btn');
const questionContainerElement = document.getElementById('question-container');
const questionElement = document.getElementById('question');
const answerButtonsElement = document.getElementById('answer-buttons');
const timerElement = document.getElementById('time');
const scoreElement = document.getElementById('score');
const resultElement = document.getElementById('result');

// Переменные состояния
let shuffledQuestions, currentQuestionIndex;
let score = 0;
let timeLeft = 60;
let timer;

// Начало квиза
startButton.addEventListener('click', startGame);
nextButton.addEventListener('click', () => {
    currentQuestionIndex++;
    setNextQuestion();
});

// Запуск игры
function startGame() {
    startButton.classList.add('hide');
    shuffledQuestions = questions.sort(() => Math.random() - 0.5);
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.innerText = score;
    timeLeft = 60;
    timerElement.innerText = timeLeft;
    questionContainerElement.classList.remove('hide');
    resultElement.classList.add('hide');
    
    startTimer();
    setNextQuestion();
}

// Таймер
function startTimer() {
    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerElement.innerText = timeLeft;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// Следующий вопрос
function setNextQuestion() {
    resetState();
    if (currentQuestionIndex >= shuffledQuestions.length) {
        endGame();
        return;
    }
    showQuestion(shuffledQuestions[currentQuestionIndex]);
}

// Показать вопрос
function showQuestion(question) {
    questionElement.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsElement.appendChild(button);
    });
}

// Сброс состояния
function resetState() {
    nextButton.classList.add('hide');
    while (answerButtonsElement.firstChild) {
        answerButtonsElement.removeChild(answerButtonsElement.firstChild);
    }
}

// Выбор ответа
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    
    Array.from(answerButtonsElement.children).forEach(button => {
        setStatusClass(button, button.dataset.correct);
        button.disabled = true;
    });
    
    if (correct) {
        score++;
        scoreElement.innerText = score;
    }
    
    if (shuffledQuestions.length > currentQuestionIndex + 1) {
        nextButton.classList.remove('hide');
    } else {
        startButton.innerText = 'Заново';
        startButton.classList.remove('hide');
    }
}

// Установка класса для ответа
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
    } else {
        element.classList.add('wrong');
    }
}

// Очистка классов статуса
function clearStatusClass(element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// Завершение игры
function endGame() {
    clearInterval(timer);
    questionContainerElement.classList.add('hide');
    resultElement.classList.remove('hide');
    resultElement.innerHTML = `
        <h2>Квиз завершен!</h2>
        <p>Ваш счет: ${score} из ${questions.length}</p>
        <p>Оставшееся время: ${timeLeft} сек</p>
    `;
    startButton.innerText = 'Заново';
    startButton.classList.remove('hide');
}