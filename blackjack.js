let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let canHit = true;

window.onload = function () {
  buildDeck();
  shuffleDeck();
  startGame();

  document.getElementById("hit").addEventListener("click", hit);
  document.getElementById("stay").addEventListener("click", stay);
  document.getElementById("restart").addEventListener("click", () => location.reload());
};

function buildDeck() {
  const values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
  const types = ["C", "D", "H", "S"];
  deck = [];

  for (let type of types) {
    for (let value of values) {
      deck.push(value + "-" + type);
    }
  }
}

function shuffleDeck() {
  for (let i = 0; i < deck.length; i++) {
    let j = Math.floor(Math.random() * deck.length);
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
  
    const dealerCard = deck.pop();
    dealerSum += getValue(dealerCard);
    dealerAceCount += checkAce(dealerCard);
    document.getElementById("dealer-cards").append(createCardImage(dealerCard));
  
    for (let i = 0; i < 2; i++) {
      const card = deck.pop();
      yourSum += getValue(card);
      yourAceCount += checkAce(card);
      document.getElementById("your-cards").append(createCardImage(card));
    }
  
    document.getElementById("your-sum").innerText = formatHandSum(yourSum, yourAceCount);
    checkSoftHand();
  }
  
  
  function hit() {
    if (!canHit) return;
  
    const card = deck.pop();
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(createCardImage(card));
  
    const adjustedSum = reduceAce(yourSum, yourAceCount);
    document.getElementById("your-sum").innerText = formatHandSum(yourSum, yourAceCount);
  
    if (adjustedSum > 21) {
      canHit = false;
      setResult("Busted! Du tapte!");
    } else {
      checkSoftHand();
    }
  }
  

  function stay() {
    canHit = false;
  
    // Vis skjult kort
    document.getElementById("hidden").src = "./cards/" + hidden + ".png";
  
    // La dealer trekke så lenge sum < 17
    while (reduceAce(dealerSum, dealerAceCount) < 17) {
      let card = deck.pop();
      dealerSum += getValue(card);
      dealerAceCount += checkAce(card);
      let cardImg = createCardImage(card);
      document.getElementById("dealer-cards").append(cardImg);
    }
  
    // Juster summer
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
  
    document.getElementById("your-sum").innerText = formatHandSum(yourSum, yourAceCount);
    document.getElementById("dealer-sum").innerText = formatHandSum(dealerSum, dealerAceCount);
    

  
    // Bestem vinner
    let message = "";
    if (yourSum > 21) {
      message = "Du tapte!";
    } else if (dealerSum > 21 || yourSum > dealerSum) {
      message = "Du vant!";
    } else if (yourSum < dealerSum) {
      message = "Du tapte!";
    } else {
      message = "Push!";
    }
  
    document.getElementById("results").innerText = message;
  }
  

function createCardImage(card) {
  let img = document.createElement("img");
  img.src = "./cards/" + card + ".png";
  return img;
}

function getValue(card) {
  let value = card.split("-")[0];
  if (isNaN(value)) {
    return value === "A" ? 11 : 10;
  }
  return parseInt(value);
}

function checkAce(card) {
  return card[0] === "A" ? 1 : 0;
}

function reduceAce(sum, aceCount) {
  while (sum > 21 && aceCount > 0) {
    sum -= 10;
    aceCount--;
  }
  return sum;
}

function formatHandSum(sum, aceCount) {
    let altSum = sum;
    let hasAlternative = false;
  
    // Finn lavere sum ved å bruke A = 1 i stedet for 11
    while (altSum > 21 && aceCount > 0) {
      altSum -= 10;
      aceCount--;
      hasAlternative = true;
    }
  
    // Hvis det finnes en alternativ sum (og vi ikke buster begge)
    if (hasAlternative && altSum <= 21) {
      return `${altSum}/${sum}`;
    } else if (sum <= 21) {
      return `${sum}`;
    } else {
      // Busted uansett
      return `${altSum}`;
    }
  }

  function checkSoftHand() {
    const isSoft = yourSum !== reduceAce(yourSum, yourAceCount);
    setResult(isSoft ? "Soft hand – pass på!" : "");
  }

  function setResult(msg) {
    document.getElementById("results").innerText = msg;
  }
  
  
  
  