(() => {
  function createGameTitle() {
    const title = document.createElement("h1");
    title.classList.add("title");
    title.textContent = "Игра в пары";
    document.body.append(title);

    return title;
  }

  function createGameForm() {
    const form = document.createElement("form");
    const label = document.createElement("label");
    const input = document.createElement("input");
    const startButton = document.createElement("button");

    form.classList.add("form");
    label.classList.add("label");
    label.textContent = "Кол-во карточек по вертикали/горизонтали";
    input.type = "text";
    input.classList.add("input");
    input.placeholder = "Введите чётное число от 2 до 10";
    startButton.classList.add("start__btn");
    startButton.textContent = "Начать игру";

    startButton.setAttribute("disabled", "disabled");
    input.oninput = () => {
      startButton.removeAttribute("disabled");
      if (input.value === "") {
        startButton.setAttribute("disabled", "disabled");
      }
    };

    startButton.addEventListener("click", () => {
      form.remove();
      document.body.append(timerGameOver(numberOfCards(input.value)));
      startGame(numberOfCards(input.value));
      startButton.setAttribute("disabled", "disabled");
    });

    document.body.append(form);
    form.append(label);
    form.append(input);
    form.append(startButton);

    return form;
  }

  function numberOfCards(value) {
    let cardNumber;
    if (value > 1 && value < 11 && !(value % 2)) {
      cardNumber = value;
    } else {
      cardNumber = 4;
    }
    return cardNumber;
  }

  function startGame(cardNumber) {
    let cardButton;
    const cardWrapper = document.createElement("div");
    cardWrapper.classList.add("card__wrapper");
    const numberArray = createCardArray(cardNumber);

    document.body.append(cardWrapper);

    let retryButton = document.querySelector('.title');
    retryButton.classList.add('retry__btn');
    retryButton.addEventListener("click", () => {
      window.location.reload();
    });

    numberArray.forEach((n) => {
      const cardWrapWidth = document.querySelector('.card__wrapper').offsetWidth;
      const cardWidth = cardWrapWidth * 0.94 / (Math.round(cardNumber));
      const cardFontSize = cardWrapWidth * 0.4 / (Math.round(cardNumber));
      cardButton = createCard(n);
      cardButton.classList.add("card");
      cardButton.setAttribute('style', `width: ${cardWidth}px; height: ${cardWidth}px; font-size: ${cardFontSize}px;`);
      cardWrapper.append(cardButton);
    });

    return {
      cardWrapper,
      cardButton,
    };
  }

  function createCardArray(cardNumber) {
    const cardArray = [];
    const cardDup = cardNumber * cardNumber;
    for (let i = 0; i < cardDup; i++) {
      i > cardDup / 2 - 1 ? (cardArray[i] = cardDup - i) : (cardArray[i] = i + 1);
    }
    // перемешать карты
    let j, temp;
    for (let i = cardArray.length - 1; i > 0; i--) {
      j = Math.round(Math.random() * (i + 1));
      temp = cardArray[j];
      cardArray[j] = cardArray[i];
      cardArray[i] = temp;
    }
    return cardArray;
  }

  function createCard(cardArray) {
    const cardButton = document.createElement("button");
    cardButton.classList.add("card");
    cardButton.textContent = cardArray;
    cardButton.addEventListener("click", () => {
      cardButton.classList.toggle("open");
      findCard(cardButton);
    });
    return cardButton;
  }

  let cardCount = 0;

  function findCard(cardButton) {
    let contains = cardButton.classList.contains("open");
    let cardTimer, buttonsActive;
    if (contains) {
      cardCount++;
      buttonsActive = document.querySelectorAll(".open");
      if (cardCount === 2) {
        clearTimeout(cardTimer);
        if (buttonsActive[0].textContent === buttonsActive[1].textContent) {
          for (let item of buttonsActive) {
            disabledCard(item);
            item.classList.add("success");
            item.classList.remove("open");
          }
        } else {
          for (let item of buttonsActive) {
            timer(item);
          }
        }
        cardCount = 0;
      }
    }
  }

  function timer(cardButton) {
    cardTimer = setTimeout(() => {
      cardButton.classList.remove("open");
    }, 400);
    return cardTimer;
  }

  function disabledCard(cardButton) {
    cardButton.setAttribute("disabled", "disabled");
  }

  function timerGameOver(cardCount) {
    const timerText = document.createElement("h2");
    let startTimer;
    let currentCount = 60;
    timerText.textContent = "Нажмите на название для презапуска!";
    clearInterval(startTimer);

    startTimer = setInterval(() => {
      if (
        currentCount === 0 ||
        document.querySelectorAll(".success").length === cardCount * cardCount
      ) {
        let buttonsActive = document.querySelectorAll(".open");
        buttonsActive.forEach((cardButton) => {
          cardButton.classList.remove("open");
        });
        let buttons = document.querySelectorAll(".card");
        buttons.forEach((cardButton) => {
          disabledCard(cardButton);
        });
        document.body.append(playAgain());
        clearInterval(startTimer);
        timerText.textContent = 'Попробуйте снова!';
      } else {
        currentCount--;
        timerText.textContent = currentCount + " сек";
      }

      if (document.querySelectorAll(".success").length === cardCount * cardCount) {
        timerText.textContent = 'Вы победили!';
      }
    }, 1000);
    return timerText;
  }

  function playAgain() {
    const againButton = document.createElement("button");
    againButton.classList.add("again__btn");
    againButton.textContent = "Сыграть еще раз";
    againButton.addEventListener("click", () => {
      window.location.reload();
    });
    return againButton;
  }

  document.addEventListener("DOMContentLoaded", () => {
    const gameTitle = createGameTitle();
    const gameForm = createGameForm();

    gameForm.addEventListener('submit', e => {
			e.preventDefault();
			if (!gameForm.input.value) {
				return;
			}
    })
  });
})();
