const socket = io();

let secretNumber = 0;
let allPlayers = [];
let guessNumber = [];

const messageContainer = document.querySelector(".message");

// Get Computer generated player guess number from server
socket.on("getGuessNumbers", (numbers) => {
  guessNumber = numbers;
  createRealPlayer(4);
  numbers.forEach((number, index) => {
    createPlayer(number, index);
  });
});

// Get secret number from server
socket.on("secretNumber", (secret) => {
  secretNumber = +secret;
  console.log(secret);
});

// Get All player from server
socket.on("createPlayer", (players) => (allPlayers = players));

// Round start button click event
const button = document.querySelector(".button");
button.addEventListener("click", () => {
  debugger;
  if (document.querySelector(".ind-4").lastElementChild.value !== "") {
    calculate();
    afterRoundStart();
  } else {
    messageContainer.innerHTML = `You guess number is required`;
  }
});

// Reset Computer generated player guesses number and add reound history in database
function afterRoundStart() {
  button.setAttribute("disabled", true);
  socket.emit("addhistory", allPlayers);
  setTimeout(() => {
    button.removeAttribute("disabled");
    socket.emit("getSecretNumber", "Secret");
    socket.emit("refershGessNumbers", "refersh");
    messageContainer.innerHTML = "";
  }, 10000);
}

// Calculate guess number is less then secret
function calculate() {
  [...document.getElementsByClassName("player")].forEach((playerEl, index) => {
    const credit = allPlayers[index]?.credit;
    if (credit > 10) {
      //check real palyer
      if (index === 0) {
        const realyPlayerGuess = +playerEl.lastElementChild.value;
        allPlayers[index].guessedNumber = realyPlayerGuess;
        allPlayers[index].credit = credit - 10;
        if (realyPlayerGuess < secretNumber) {
          playerEl.childNodes.item(1).classList.add("real-player");
          playerEl.childNodes.item(1).style.height = `${secretNumber * 5}vh`;
          playerEl.childNodes.item(1).style.background = "red";
          playerEl.childNodes.item(1).innerHTML = `Won`;
          allPlayers[index].credit =
            allPlayers[index].credit + realyPlayerGuess * 10;

          applyAnimation(`.real-player`);
        }
      } else {
        const quess = +guessNumber[index - 1];
        allPlayers[index].guessedNumber = quess;
        allPlayers[index].credit = credit - 10;
        if (quess < secretNumber) {
          playerEl.firstElementChild.classList.add(`player_${index}`);
          playerEl.firstElementChild.style.height = `${secretNumber * 5}vh`;
          playerEl.firstElementChild.style.background = "red";
          playerEl.firstElementChild.innerHTML = `Won`;
          allPlayers[index].credit = allPlayers[index].credit + quess * 10;

          applyAnimation(`.player_${index}`);
        }
      }
    } else {
      messageContainer.innerHTML = `You don't have enough credit.`;
    }
  });
}

//apply animation
function applyAnimation(Elclass) {
  gsap.from(Elclass, {
    y: 120,
    ease: "elastic",
    duration: 3,
    delay: 1,
  });
}

// Create computer genetated player
function createPlayer(guessNumber, index) {
  const maindiv = document.querySelector(".players");
  const div = document.createElement("div");
  const divName = document.createElement("div");
  const divSuccess = document.createElement("div");
  divSuccess.classList.add("success");
  divName.innerHTML = `Player_${index + 1}`;
  div.append(divSuccess);
  div.append(divName);
  div.classList.add("player");
  div.classList.add(`ind-${index}`);
  maindiv.appendChild(div);
}

// Create Real player
function createRealPlayer(index) {
  const maindiv = document.querySelector(".players");
  maindiv.innerHTML = "";
  const div = document.createElement("div");
  const divName = document.createElement("div");
  const divSuccess = document.createElement("div");
  divSuccess.classList.add("success");
  divName.innerHTML = "Real player";
  div.classList.add("player");
  div.classList.add(`ind-${index}`);
  const input = document.createElement("input");
  input.setAttribute("type", "text");
  input.setAttribute("placeholder", "Your guess number");
  input.setAttribute("maxlength", "4");
  div.append(divName);
  div.append(divSuccess);
  div.append(input);
  maindiv.appendChild(div);
}
