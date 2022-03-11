// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">
let map;
let service;
let infowindow;

function initMap() {
  const riga = new google.maps.LatLng(56.949907201814675, 24.10355411105006);
  // Array that stores results of all places ID's
  const allId = [];
  // Array storing additional information recieved from place ID's
  const allInformation = [];

  infowindow = new google.maps.InfoWindow();
  map = new google.maps.Map(document.getElementById("map"), {
    center: riga,
    zoom: 12,
  });

  // Names of all supporters
  const supporters = ["KURTS coffee", "PURCH"];

  // Creates service
  service = new google.maps.places.PlacesService(map);

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
          // console.log(allId[i])
        }
      }
    });
  });

  setTimeout(() => {
    console.log(allId); // why is this showing all values? 0: .. 1: ... 3:
    console.log(allId[2]); // but this is showing as undefined??

    // Collect information about places by place_id that is not accessible by regular query search
    let additionalRequest = {
      // placeId: 'ChIJx-XDiMbP7kYRn7vptgFhk4Q',
      placeId: allId[0],
      fields: [
        "name",
        "address_components",
        "place_id",
        "geometry",
        "international_phone_number",
      ],
    };

    // Get details from ID
    service.getDetails(additionalRequest, (place, status) => {
      // place object contains all returned fields. Recieve info by, for example, accessing place.place_id
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

        // console.log(place.international_phone_number) // How to get info
        // console.log(place.address_components[4].long_name) // How to get info

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

          placeAddressElement.textContent = place.address_components[2];
          content.appendChild(placeAddressElement);
          infowindow.setContent(content);
          infowindow.open(map, marker);
        });
      }
    });
  }, 120);
}
