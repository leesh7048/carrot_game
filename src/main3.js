"use strict";
const GAME_DURATION_SEC = 5;
const CARROT_COUNT = 5;

const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const gameBtn = document.querySelector(".toggle__btn");
const gameTimer = document.querySelector(".timer");
const gameScore = document.querySelector(".score");
const popUp = document.querySelector(".pop-up");
const popUpText = document.querySelector(".pop-up__message");
const popUpBtn = document.querySelector(".pop-up__btn");

// 사운드
const carrotSound = new Audio("./sound/carrot_pull.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const bgSound = new Audio("./sound/bg.mp3");
const winSound = new Audio("./sound/game_win.mp3");
const alertSound = new Audio("./sound/alert.wav");

let started = false;
let score = 0;
let timer = undefined;

function playSound(sound) {
  sound.currentTime = 0;
  sound.play();
}
function stopSound(sound) {
  sound.pause();
}

gameBtn.addEventListener("click", gameBtnClick);
function gameBtnClick() {
  if (started) {
    gameStop();
  } else {
    gameStart();
  }
}
function gameStop() {
  started = false;
  stopSound(bgSound);
  playSound(alertSound);
  stopGameTimer();
  showPopUpWithText("REPLAY?");
  hideStopBtn();
}
function showPopUpWithText(text) {
  popUpText.innerText = text;
  popUp.classList.remove("pop-up--hide");
}
function stopGameTimer() {
  clearInterval(timer);
}
function gameStart() {
  playSound(bgSound);
  started = true;

  initGame();
  showStopButton();
  startGameTimer();
}
function showStopButton() {
  const icon = document.querySelector(".fas");
  icon.classList.add("fa-stop");
  icon.classList.remove("fa-play");
}
function startGameTimer() {
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
function updateTimerText(time) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  gameTimer.innerText = `${minutes < 10 ? `0${minutes}` : minutes}: ${
    seconds < 10 ? `0${seconds}` : seconds
  }`;
}
field.addEventListener("click", (e) => {
  if (!started) {
    return;
  }

  const target = e.target;
  if (target.matches(".carrot")) {
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === 5) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
});
function finishGame(win) {
  started = false;

  stopSound(bgSound);
  stopGameTimer();
  hideStopBtn();
  if (win) {
    showPopUpWithText("YOU WIN!!");
    playSound(winSound);
  } else {
    playSound(bugSound);
    showPopUpWithText("YOU LOST!!");
  }
}
function hideStopBtn() {
  gameBtn.style.visibility = "hidden";
}
function showstopBtn() {
  gameBtn.style.visibility = "visible";
}

function updateScoreBoard() {
  gameScore.innerText = CARROT_COUNT - score;
}
popUpBtn.addEventListener("click", () => {
  showstopBtn();
  gameStart();
  hidePopUp();
});
function hidePopUp() {
  popUp.classList.add("pop-up--hide");
}
function initGame() {
  score = 0;
  field.innerHTML = "";
  gameScore.innerText = CARROT_COUNT;

  addItem("carrot", 5, "img/carrot.png");
  addItem("bug", 5, "img/bug.png");
}
function addItem(className, count, imgPath) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - 80;
  const y2 = fieldRect.height - 80;
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
