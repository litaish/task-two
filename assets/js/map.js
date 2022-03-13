// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;
let allMarkers = [];
let allInfo = [];

function findIds() {
  // Array that stores results of all places ID's
  const allId = [];

  // Names of all supporters
  const supporters = ["KURTS coffee", "PURCH"];

  supporters.forEach((supporter) => {
    // Requesting for place id by name from supporters array
    const IDrequest = {
      query: supporter,
      fields: ["place_id"],
    };

    //Finding results for each query
    service.findPlaceFromQuery(IDrequest, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        for (let i = 0; i < results.length; i++) {
          // Add results to an array that contains all results of ID's
          allId.push(results[i].place_id);
        }
      }
    });
  });
  return allId;
}

async function findAdditionalInfo(requestedIds, callback) {
  requestedIds.forEach(async (Id, i) => {
    // Collect information about places by place_id that is not accessible by regular query search
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

    // Pass in the iteration results (place) and status to the callback function
    callback(results, status, getAllMarkers, filterSmth);
  });
  setTimeout(() => {
    handleSelectChange();
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

  // Wait for ID array to populate and run find additional info function
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

    // Adding all markers to array, title is used for identifying purposes
    marker.setTitle(place.place_id);
    allMarkers.push(marker);

    // marker.setVisible(false) works

    // On click on marker, display information recieved from the requests
    google.maps.event.addListener(marker, "click", () => {
      // Pop up window displaying all information about location on map
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

    // Push iteration results in an array
    allInfo.push([
      place.name,
      place.place_id,
      place.international_phone_number,
      place.address_components[1].long_name,
      place.address_components[0].long_name,
      place.address_components[3].long_name,
      place.types,
      marker.title,
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

function handleSelectChange() {
  const selectCityEl = document.getElementById("selectCity");
  const selectTypeEl = document.getElementById("selectType");

  // Object that will store selected city and type
  let selectedFields = {
    city: undefined,
    type: undefined,
  };

  selectCityEl.addEventListener("change", () => {
    // selectedFields.city = selectCityEl.value;
    // console.log(selectedFields.city, selectedFields.type);
    for (let i = 0; i < allMarkers.length; i++) {
      
      for (let j = 0; j < allInfo.length; j++) {
        if (allMarkers[i].title == allInfo[j][1]) {
          console.log("here");
          if (allInfo[j][5] == selectCityEl.value) {
            
            allMarkers[i].setVisible(true);
          } else {
            allMarkers[i].setVisible(false);
          }
        }
      }
    }
  });

  selectTypeEl.addEventListener("change", () => {
    // selectedFields.type = selectTypeEl.value;
    // console.log(selectedFields.city, selectedFields.type);
  });

  // allMarkers[0].setVisible(false)
}

function setAllMarkersVisable() {
  allMarkers.forEach((marker) => {
    marker.setVisible(true);
  });
}
