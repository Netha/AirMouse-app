let socket;

socket = io.connect(`http://${window.location.hostname}:81`);

document.body.classList.add('active')

let firstTime = true;
let first_alpha;

window.addEventListener("deviceorientation", function (event) {
  while (firstTime) {
    firstTime = false;
    first_alpha = event.alpha;
  }
})

if (window.DeviceOrientationEvent) {

  window.addEventListener("deviceorientation", function (event) {
    socket.emit('input', {
      beta: event.beta,
      alpha: event.alpha,
      f_alpha: first_alpha
    });

  });

} else {

  alert("Sorry, your browser doesn't support Device Orientation");

}


$('.rightBtn').click(function () {
  socket.emit('click', 'right');
})
