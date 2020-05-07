const quizForm = document.querySelector("form");
const scoreUi = document.querySelector("[data-score]");

const questionsAndAnswersBank = [
  {
    question: "From which language is the word ‘ketchup’ derived?",
    options: ["Spanish", "Chinese", "Hindu"],
    correctAnswerIndex: "1",
  },
  {
    question: "H2O is the chemical formula for what?",
    options: ["Soap", "Water", "Salt"],
    correctAnswerIndex: "1",
  },
  {
    question:
      "Which English football team plays its home matches at Old Trafford?",
    options: ["Manchester United", "Burnley", "Bolton Wanderers"],
    correctAnswerIndex: "0",
  },
  {
    question: "In the medical profession, what do the initials ‘GP’ stand for?",
    options: [
      "Gauge Pressure",
      "Grade Point",
      "General practitioner",
    ],
    correctAnswerIndex: "2",
  },
  {
    question: "Blandenburg, Bremen and Lower Saxony are states in which European country?",
    options: ["Kenya", "Germany", "France"],
    correctAnswerIndex: "1",
  },
];
const answeredQuestions = [];

const ScoreManager = function () {
  this.score = 0;
};

ScoreManager.prototype.increaseScoreBy = function (increment) {
  this.score += increment;
  return this;
};

ScoreManager.prototype.updateScoreUi = function (element) {
  element.innerHTML = `${this.score} question${
    this.score === 0 || this.score > 1 ? "s" : ""
  } answered correctly`;
  return this;
};

const scoreManager = new ScoreManager();

const generateQAMarkup = (questionIndex) => {
  const question = questionsAndAnswersBank[questionIndex].question;
  const optionsMarkup = questionsAndAnswersBank[questionIndex].options.reduce(
    (accum, option, optionIndex) => {
      accum += `
      <label data-option="opt-${optionIndex}">
        <input type="radio" name="q${
          questionIndex + 1
        }" value="${optionIndex}" onclick="markAnswer(event, ${questionIndex})">
          ${option}
      </label>`;
      return accum;
    },
    ""
  );
  const markup = `
    <h2 class="question-count">Question ${questionIndex + 1}</h2>
    <h3>${question}</h3>
    <div class="answers">
      ${optionsMarkup}
    </div>
    <button type="button" onclick="displayNext(${questionIndex + 1})">
      ${
        questionIndex === questionsAndAnswersBank.length - 1 ? "Finish" : "Next"
      }
    </button>
  `;
  return markup;
};

const markAnswer = (event, questionIndex) => {
  if (answeredQuestions.includes(questionIndex)) {
    event.preventDefault();
    return;
  }
  const selectedOpt = event.target.value;
  const correctOpt = questionsAndAnswersBank[questionIndex].correctAnswerIndex;

  if (selectedOpt === correctOpt) {
    scoreManager.increaseScoreBy(1).updateScoreUi(scoreUi);
    answeredQuestions.push(questionIndex);
    document
      .querySelector(`[data-option=opt-${selectedOpt}]`)
      .classList.add("correct-option");
    return;
  }
  scoreManager.increaseScoreBy(0).updateScoreUi(scoreUi);
  answeredQuestions.push(questionIndex);
  document
    .querySelector(`[data-option=opt-${selectedOpt}]`)
    .classList.add("wrong-option");
  document
    .querySelector(`[data-option=opt-${correctOpt}]`)
    .classList.add("correct-option");
};

const displayNext = (index = 0) => {
    quizForm.classList.remove("opacity");
  if (index < questionsAndAnswersBank.length) {
    quizForm.innerHTML = generateQAMarkup(index);
    quizForm.classList.toggle('opacity')
  } else {
    endGame();
  }
};

const endGame = () => {
  document.querySelector("main").removeChild(quizForm);
  document.querySelector("main").innerHTML = `
  <h2>End of quiz</h2>
  <h3>Total score obtained: ${scoreManager.score}</h3>
  `;
};

function initQuiz() {
  document.querySelector("[data-score]").innerHTML = `0 questions answered`;
  displayNext();
}

initQuiz();