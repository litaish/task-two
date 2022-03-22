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

let appended = false;

/*
  Opens up a youtube video popup 
 */
function handleVideoOpen(targetElement, element) {

  // If video container is already created, toggle visibility once clicked again.
  if (appended) {
    toggleVideoPopup();
    return;
  }

  const videoContainer = document.createElement('div');
  videoContainer.classList.add('video-popup-wrapper');
  videoContainer.setAttribute('id', 'videoOverlay')
  document.body.appendChild(videoContainer)
  
  videoContainer.innerHTML = `
      <div class="video-container">
          <button class="close-video-btn" style="background: url('./assets/img/other/video_close.png') no-repeat;" onclick="toggleVideoPopup();"></button>
        <div class="video-wrapper">
          <video id="myVideo" class="story-video" src="${element["video"]}" poster="${element["thumbnail"]}" onclick="playVideo();">
            <source src="${element["video"]}" type="video/mp4">
          </video>
          <a id="playBtn" class="play-circle play-popup" onclick="playVideo();"><i class="fa fa-play fa-2x"></i></a>
        </div>
        <h2 class="f-oswald-video-alttext video-alt-text">${element["altText"]}</h2>
      </div>
  `;
  appended = true;
}
/*
  Triggered on X button onclick event
*/
function toggleVideoPopup(){
  const videoPopup = document.getElementById('videoOverlay');
  
  videoPopup.style.display = videoPopup.style.display == "none" ? "block" : "none";
}

/*
  Plays video with custom play button
 */
function playVideo() {
  const playButton = document.getElementById('playBtn');
  const video = document.getElementById('myVideo');

  if (video.paused == true) {
    // Play the video
    playButton.style.display = 'none';
    video.play();
  } else {
    // Pause the video
    playButton.style.display = 'inline';
    video.pause();
  }
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

