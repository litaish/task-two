let video = document.getElementById('myVideo');

function playVideo() {
  if (video.paused == true) {
    // Play the video
    video.play();
  } else {
    // Pause the video
    video.pause();
  }
}
