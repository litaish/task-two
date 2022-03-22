const video = document.getElementById('myVideo');
const playButton = document.getElementById('playBtn');

video.addEventListener('click', () => {
  playVideo();
})

function playVideo() {
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
