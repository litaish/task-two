// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;
let allMarkers = [];
let allInfo = [];

function initSupporters() {
  let supportersDict = new Object();
  supportersDict = [
    {
      name: "KURTS coffee",
      img: "./assets/img/supporters-logos/kurts_coffee.png",
    },

    {
      name: "PURCH",
      img: "./assets/img/supporters-logos/purch_restaurant.png",
    },
  ];

  return supportersDict;
}

function findIds() {
  const allId = [];

  let supportersDict = initSupporters();

  for (let i = 0; i < supportersDict.length; i++) {
    const IDrequest = {
      query: supportersDict[i].name,
      fields: ["place_id"],
    };

    //Finding results for each query
    service.findPlaceFromQuery(IDrequest, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          allId.push(results[i].place_id);
        }
      }
    });
  }

  return allId;
}

async function findAdditionalInfo(requestedIds, callback) {
  requestedIds.forEach(async (Id, i) => {
    let additionalRequest = {
      placeId: Id,
      fields: [
        "name",
        "address_components",
        "place_id",
        "geometry",
        "international_phone_number",
        "types",
      ],
    };

    const { results, status } = await new Promise((resolve) =>
      service.getDetails(
        additionalRequest,
        // pass a callback to getDetails that resolves the promise
        (results, status) => resolve({ results, status })
      )
    );

    callback(results, status, getAllMarkers, filterSmth);
  });
  setTimeout(() => {
    filterMarkers();
  }, 100);
}

async function initMap() {
  const riga = new google.maps.LatLng(56.949907201814675, 24.10355411105006);

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: riga,
    zoom: 12,
  });

  service = new google.maps.places.PlacesService(map);

  let requestedIds = findIds();

  setTimeout(async () => {
    findAdditionalInfo(requestedIds, handleAdditionalInfo);
  }, 1000);
}

// var allInfo = [];
function handleAdditionalInfo(place, status, callback, callback2) {
  if (
    status === google.maps.places.PlacesServiceStatus.OK &&
    place &&
    place.geometry &&
    place.geometry.location
  ) {
    const marker = new google.maps.Marker({
      map,
      position: place.geometry.location,
    });

    marker.setTitle(place.place_id);
    allMarkers.push(marker);

    google.maps.event.addListener(marker, "click", () => {
      const content = document.createElement("div");
      const nameElement = document.createElement("h2");

      nameElement.textContent = place.name;
      content.appendChild(nameElement);

      const placeIdElement = document.createElement("p");

      placeIdElement.textContent = place.place_id;
      content.appendChild(placeIdElement);

      const placeAddressElement = document.createElement("p");

      placeAddressElement.textContent = place.address_components[3].long_name;
      content.appendChild(placeAddressElement);
      infowindow.setContent(content);
      infowindow.open(map, marker);
    });

    let fullStreetName =
      place.address_components[1].long_name +
      " " +
      place.address_components[0].long_name; //  Street name + street number

    // Push iteration results in an array
    allInfo.push([
      place.name,
      marker,
      place.place_id,
      place.international_phone_number,
      place.address_components[3].long_name, // City
      fullStreetName,
      place.types,
      status,
    ]);
  }

  // Handle populated array here
  callback(allInfo);
  callback2(allInfo);
}

function getAllMarkers(allInfo) {
  // console.log(allMarkers);
  // console.log(allInfo);
}
function filterSmth(arr) {
  // console.log(arr);
}

function filterMarkers() {
  selects = document.getElementsByTagName("select");

  let filteredMarkers;

  for (let i = 0; i < selects.length; i++) {
    // Add an event listener for each select component that will trigger the filtering process
    selects[i].addEventListener("change", () => {
      let selectedCity = document.getElementById("selectCity").value;
      let selectedType = document.getElementById("selectType").value;

      filteredMarkers = allMarkers.filter(function (currentMarker) {
        for (let i = 0; i < allInfo.length; i++) {
          // Finding a match for title (place_id)
          if (
            allInfo[i][4] == selectedCity &&
            allInfo[i][6].includes(selectedType)
          ) {
            return true;
          }
        }
      });

      console.log(filteredMarkers);

      // Set markers not present in [filteredMarkers] array to invisible
      for (let k = 0; k < allInfo.length; k++) {
        if (filteredMarkers.includes(allInfo[k][1])) {
          allInfo[k][1].setVisible(true);
        } else {
          allInfo[k][1].setVisible(false);
        }
      }
      displayMarkerInfo(filteredMarkers);
    });
  }
}

/*
  Displays information about the filtered markers location (logo image,
    name, streets, phone numbers). Information is displayed
    in table cells.
 */
function displayMarkerInfo(filteredMarkersArr) {
  // Clear all table content on select change
  const tableContent = document.getElementById("supportersTable");
  tableContent.innerHTML = "";

  //   var img = new Image();
  // img.src = "http://yourimage.jpg";
  let supportersDict = initSupporters();

  for (let i = 0; i < filteredMarkersArr.length; i++) {
    for (let j = 0; j < allInfo.length; j++) {

      // Finding a match between all markers and filtered markers
      if (filteredMarkersArr[i] == allInfo[j][1]) {
        let locNameEl = document.createElement("p");
        locNameEl.innerText = allInfo[j][0];
        locNameEl.classList.toggle("f-mont-blue24-normal");

        let locNumberEl = document.createElement("p");
        locNumberEl.innerText = allInfo[j][3];
        locNumberEl.classList.toggle("f-mont-paragraph");

        let fullStreetEl = document.createElement('p');
        fullStreetEl.innerText = allInfo[j][5];
        fullStreetEl.classList.toggle("f-mont-paragraph");

        // Create empty row element
        let row = tableContent.insertRow(i);

        // Insert cells
        let cellOne = row.insertCell(-1);
        cellOne.appendChild(locNameEl);
        cellOne.style.textAlign = "left";

        let cellTwo = row.insertCell(-1);
        cellTwo.appendChild(locNumberEl);
        cellTwo.appendChild(fullStreetEl);
        cellTwo.style.textAlign = "right";
      }
    }
  }
}

/*
  Returns an array that merges rows, if two rows with same *name* property are present.
  Values are merged with a comma. Function displayMarkerInfo(filteredMarkersArr) requires
  for a location to be displayed only once, if Places API returns two results for one establishment name.
 */
function mergeInfo() {
  let mergedArrayInfo = [];
}
