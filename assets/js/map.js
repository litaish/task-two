
function initMap() {
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: { lat: 56.949907201814675, lng: 24.10355411105006 },
  });

  const supporterCoords = [
    [{ lat: 56.95119649262944, lng: 24.12072958485581 }, "KURTS coffee"], // KURTS coffee
    [{ lat: 56.95176394846084, lng: 24.10901714079013 }, "KURTS coffee"], // KURTS coffee Alternative
    [{ lat: 56.95813015234117, lng: 24.190976385703554 }, "PURCH"], // PURCH restaurant
  ];
  // Create an info window to share between markers.
  const infoWindow = new google.maps.InfoWindow();

  // Create the markers.
  supporterCoords.forEach(([position, title], i) => {
    const marker = new google.maps.Marker({
      position,
      map,
      title: `${i + 1}. ${title}`,
      label: `${i + 1}`,
      optimized: false,
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      infoWindow.close();
      infoWindow.setContent(marker.getTitle());
      infoWindow.open(marker.getMap(), marker);
    });
  });
}