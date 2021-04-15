"use strict";
const CARROT_COUNT = 10;
const BUG_COUNT = 10;
const CARROT_SIZE = 80;
const GAME_DURATION_SEC = 10;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".toggle__btn");
const gameTimer = document.querySelector(".timer");
const gameScore = document.querySelector(".score");
const popUp = document.querySelector(".pop-up");
const popUpBtn = document.querySelector(".pop-up__btn");
const popUpText = document.querySelector(".pop-up__message");
// 사운드
const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const alertSound = new Audio("./sound/alert.wav");

//게임이 시작했는지 아닌지 알수있는 변수
let started = false;
//최종 점수를 기억하는 변수
let score = 0;
//남은 시간 기억하는 변수
let timer = undefined;

gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});

popUpBtn.addEventListener("click", () => {
  startGame();
  hidePopUp();
});
function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}
function startGame() {
  playSound(bgSound);
  started = true;
  initGame();
  showStopButton();
  startGameTimer();
}
function startGameTimer() {
  //남아있는 시간
  let ramainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(ramainingTimeSec);
  timer = setInterval(() => {
    if (ramainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(CARROT_COUNT === score);
      return;
    }
    updateTimerText(--ramainingTimeSec);
  }, 1000);
}
function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes < 10 ? `0${minutes}` : minutes}:${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText("REPLAY?");
  stopSound(bgSound);
  playSound(alertSound);
}
function finishGame(win) {
  started = false;
  stopSound(bgSound);
  stopGameTimer();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  showPopUpWithText(win ? "YOU WON" : "YOU LOST");
}

function showPopUpWithText(text) {
  popUpText.innerHTML = text;
  popUp.classList.remove("pop-up--hide");
}
function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}
function showGameButton() {
  gameBtn.style.visibility = "visible";
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}
function initGame() {
  score = 0;
  field.innerHTML = "";
  gameScore.innerText = CARROT_COUNT;
  addItem("carrot", CARROT_COUNT, "img/carrot.jpg");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

field.addEventListener("click", onFieldClick);
function onFieldClick(e) {
  //started가 false일때 리턴
  if (!started) {
    return;
  }
  const target = e.target;
  if (target.matches(".carrot")) {
    playSound(carrotSound);
    target.remove();
    score++;
    updateScoreBoard();
    if (score === 10) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}
function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}
function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}

function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - CARROT_SIZE;
  const y2 = fieldRect.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field.appendChild(item);
  }
}
function randomNumber(min, max) {
  return Math.random() * (max - min) + min;
}
