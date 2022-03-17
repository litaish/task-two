console.log("hello");

// https://litaish.github.io/task-two/assets/json/cards.json

// Create an instance of XMLHttpRequest()
let cardsRequest = new XMLHttpRequest();

// Open connection, specify method (GET - recieve), specify URL
cardsRequest.open('GET', 'https://litaish.github.io/task-two/assets/json/cards.json');

// Specify function that runs once the connection is loaded
cardsRequest.onload = function() {
    // Store recieved data ina variable
    let cardsData = JSON.parse(cardsRequest.responseText);
    renderCards(cardsData)
}

// Send request
cardsRequest.send();

function renderCards(data){
    
    const container = document.getElementById('storiesGrid');

    data.forEach(element => {

        let content;

        if (element['active']) {

            // If element has alt text instead of image
            if (element['altText']) {
                content = `
            <figure id="card-${element['id']}" class="story-card">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <h2 class="card-inner-text">${element['altText']}</h2>
                <span class="f-oswald-card-number">${element['id']}</span>
            </figure> 
            `
            }
            // If element has no altext but has image
             else {
                content = `
            <figure id="card-${element['id']}" class="story-card" style="background-image: url(./assets/img/stories/${element['id']}.png)">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <span class="f-oswald-card-number">${element['id']}</span>
            </figure> 
            `
             }

            container.innerHTML += content;
        } else {

            // If element is inactive and has to be announced text
                if (element['tbaText']) {
                    content = `
            <figure id="card-${element['id']}" class="story-card story-card-inactive">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <h2 class="card-inner-text">${element['tbaText']}</h2>
                <span class="f-oswald-card-number">${element['id']}</span>
            </figure> 
            `
                } else {
                    content = `
            <figure id="card-${element['id']}" class="story-card story-card-inactive">
                <img class="card-yellow-overlay" src="./assets/img/stories/yellow-overlay.png" alt="Yellow overlay">
                <span class="f-oswald-card-number">${element['id']}</span>
            </figure> 
            `
                }

            container.innerHTML += content;
        }
    });
}


