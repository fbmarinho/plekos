window.AudioContext = window.AudioContext || window.webkitAudioContext;

var context = new AudioContext();
var o = null;
var g = null;

function playNote(freq, type, duration) {
  o = context.createOscillator();
  g = context.createGain();
  o.connect(g);
  o.type = type;
  o.frequency.value = freq;
  g.connect(context.destination);
  o.start(0);

  g.gain.exponentialRampToValueAtTime(
    0.00001,
    context.currentTime + duration
  );
}

function stop(decreaseTime) {
  g.gain.exponentialRampToValueAtTime(
    0.00001,
    context.currentTime + decreaseTime
  );
}