const field = document.querySelector(".game__field");
const fieldRect = field.getBoundingClientRect();
const toggleBtn = document.querySelector(".toggle__btn");
const score = document.querySelector(".score");
const timer = document.querySelector(".timer");
const popUpBtn = document.querySelector(".pop-up__btn");
const popUp = document.querySelector(".pop-up");
const popUpMessage = document.querySelector(".pop-up__message");

const CARROT_COUNT = 10;
const BUG_COUNT = 10;

toggleBtn.addEventListener("click", toggleBtnClick);

function toggleBtnClick() {
  timer.textContent = CARROT_COUNT;
  score.textContent = CARROT_COUNT;
  if (toggleBtn.dataset.id === "start") {
    addItem("carrot", CARROT_COUNT, "img/carrot.png");
    addItem("bug", BUG_COUNT, "img/bug.png");
    timers();
    toggleBtn.dataset.id = "end";
    toggleBtn.innerHTML = `<i class="fas fa-stop"></i>`;
  } else {
    toggleBtn.innerHTML = `<i class="fas fa-play"></i>`;
    popUp.classList.remove("pop-up--hide");
  }
}
function timers() {
  setInterval(() => {
    if (timer.textContent === "0") {
      popUpMessage.textContent = "YOU LOST";
      popUp.classList.remove("pop-up--hide");
      clearInterval();
    } else if (popUp.className === "pop-up") {
      clearInterval();
    } else {
      timer.textContent--;
    }
  }, 1000);
}
function addItem(className, count, imgsrc) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect.width - 80;
  const y2 = fieldRect.height - 80;
  for (let i = 0; i < count; i++) {
    const img = document.createElement("img");
    img.setAttribute("class", className);
    img.setAttribute("src", imgsrc);
    img.style.position = "absolute";
    const x = randomNum(x1, x2);
    const y = randomNum(y1, y2);
    img.style.left = `${x}px`;
    img.style.top = `${y}px`;
    field.appendChild(img);
  }
  field.addEventListener("click", itemClick);
}

function itemClick(e) {
  const target = e.target;
  const className = target.className;

  if (className === "carrot") {
    target.remove();
    score.textContent--;
  } else if (className === "bug") {
    popUpMessage.textContent = "YOU LOST";
    popUp.classList.remove("pop-up--hide");
  }
  if (score.textContent === "0") {
    popUpMessage.textContent = "YOU WIN";
    popUp.classList.remove("pop-up--hide");

    return;
  }
}

function randomNum(min, max) {
  return Math.random() * (max - min) + min;
}

function popUpBtnClick() {
  window.location.reload();
}

popUpBtn.addEventListener("click", popUpBtnClick);
