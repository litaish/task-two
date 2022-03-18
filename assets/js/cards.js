// Create an instance of XMLHttpRequest()
let cardsRequest = new XMLHttpRequest();

// Open connection, specify method (GET - recieve), specify URL
cardsRequest.open(
  "GET",
  "https://litaish.github.io/task-two/assets/json/cards.json"
);

// Specify function that runs once the connection is loaded
cardsRequest.onload = function () {
  // Store recieved data ina variable
  let cardsData = JSON.parse(cardsRequest.responseText);
  renderCards(cardsData);
};

// Send request
cardsRequest.send();

function renderCards(data) {
  const container = document.getElementById("storiesGrid");

  data.forEach((element) => {
    let content;
    let card;

    if (element["active"]) {
      // If element has alt text instead of image
      if (element["altText"]) {
        card = document.createElement("figure");
        let cardId = `card-${element["id"]}`;
        card.setAttribute("id", cardId);
        card.className = "story-card story-card-active card-active-alt";

        img = document.createElement("img");
        img.className = "card-yellow-overlay";
        img.src = "./assets/img/stories/yellow-overlay.png";
        card.appendChild(img);

        altText = document.createElement("h2");
        altText.className = "card-inner-text f-oswald-alt-text card-alt-text";
        altText.innerText = `${element["altText"]}`;
        card.appendChild(altText);

        numberSpan = document.createElement("span");
        numberSpan.className = "f-oswald-card-number";
        numberSpan.innerText = `${element["id"]}`;
        card.appendChild(numberSpan);
      }
      // If element has no alt text but has image
      else {
        card = document.createElement("figure");
        card.style.backgroundImage = `url(./assets/img/stories/${element["id"]}.png)`;
        let cardId = `card-${element["id"]}`;
        card.setAttribute("id", cardId);
        card.className = "story-card story-card-active";

        img = document.createElement("img");
        img.className = "card-yellow-overlay";
        img.src = "./assets/img/stories/yellow-overlay.png";
        card.appendChild(img);

        numberSpan = document.createElement("span");
        numberSpan.className = "f-oswald-card-number";
        numberSpan.innerText = `${element["id"]}`;
        card.appendChild(numberSpan);
      }

      container.appendChild(card);

      // If element has video attribute available, make it run event
      if (element["video"]) {
        img.classList.toggle("video-active");

        container.addEventListener("click", (e) => {
          if (e.target.classList.contains("video-active")) {
            handleVideoOpen(e.target, element);
          }
        });
      }
    } else {
      // If element is inactive and has tba text
      if (element["tbaText"]) {
        content = `
            <figure id="card-${element["id"]}" class="story-card story-card-inactive">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <h2 class="card-inner-text f-oswald-tba-text">${element["tbaText"]}</h2>
                <span class="f-oswald-card-number">${element["id"]}</span>
            </figure> 
            `;
      // If element is inactive but has no tba text
      } else {
        content = `
            <figure id="card-${element["id"]}" class="story-card story-card-inactive">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <span class="f-oswald-card-number">${element["id"]}</span>
            </figure> 
            `;
      }

      container.innerHTML += content;
    }
  });
}

function handleVideoOpen(targetElement, element) {
  // Run video window popup code here
  console.log(targetElement);
  console.log(element);
}
