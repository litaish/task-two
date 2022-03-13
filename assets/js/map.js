// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

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
  var allInfo = [];

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
        "type",
      ],
    };

    const { results, status } = await new Promise((resolve) =>
      service.getDetails(
        additionalRequest,
        // pass a callback to getDetails that resolves the promise
        (results, status) => resolve({ results, status })
      )
    );

    callback(results, status, printEverythingIntheArr, filterSmth);
  });
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
    findAdditionalInfo(requestedIds, printTheArray);
  }, 1000);
}

var test = [];
function printTheArray(place, status, callback, callback2) {
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
  }

  test.push([place, status]);
  callback(test);
  callback2(test);
}

function printEverythingIntheArr(arr) {
  console.log(arr);
}
function filterSmth(arr) {
  console.log(arr);
}
