const SCREEN_WIDTH_TAB = 1024;
const SCREEN_WIDTH_MOB = 768;

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
  // Count number of JSON objects
  let numOfEntries = cardsData.length;

  renderCards(cardsData);
  toggleLoadMore(numOfEntries);
};

// Send request
cardsRequest.send();

/*
  Render cards on stories grid based on retrieved JSON data.
 */
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

/*
  Opens up a youtube video popup 
 */
function handleVideoOpen(targetElement, element) {
  console.log(targetElement);
  console.log(element);
  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-popup-wrapper');
  document.body.appendChild(videoContainer)
  
  videoContainer.innerHTML = `
    <video class="story-video" src="${element["video"]}">
      <source src="${element["video"]}" type="video/mp4">
    </video>
  `;
}

/*
  Add a "load more" feature in tablet and phone widths
  for stories grid.
 */
function toggleLoadMore(numOfCards) {
  const storiesGridWrapper = document.getElementById("storiesGridWrapper");

  // If screen is tablet size and smaller
  if (window.matchMedia(`(max-width: ${SCREEN_WIDTH_TAB}px)`).matches) {
    // Add a load more button (below grid)
    const loadMoreBtn = document.createElement("button");
    loadMoreBtn.classList.add(
      "load-more-btn",
      "btn-yellow-choice",
      "f-mont-choice-btn"
    );
    loadMoreBtn.innerText = "Skatīt vairāk";
    storiesGridWrapper.appendChild(loadMoreBtn);

    // Card number from which to start hiding cards
    let start = 21;
    hideCards(start, numOfCards);

    // Keeps track if cards are hidden or not
    let hidden = true;

    // Hide all cards starting from a specific number on button click
    loadMoreBtn.addEventListener("click", () => {
      if (!hidden) {
        hideCards(start, numOfCards);
        hidden = true;
        loadMoreBtn.innerText = "Skatīt vairāk";
      } else {
        showCards(start, numOfCards);
        hidden = false;
        loadMoreBtn.innerText = "Skatīt mazāk";
      }
    });
  }
}

function hideCards(start, totalNumOfCards) {
  for (let i = start; i <= totalNumOfCards; i++) {
    let cardEl = document.getElementById(`card-${i}`);
    cardEl.style.display = "none";
  }
}

function showCards(start, totalNumOfCards) {
  for (let i = start; i <= totalNumOfCards; i++) {
    let cardEl = document.getElementById(`card-${i}`);
    cardEl.style.display = "inline-block";
  }
}

