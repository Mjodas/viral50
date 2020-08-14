/*! viral-50 v0.0.1 | (c) 2020 Erik Båvenstrand | MIT License | https://github.com/ErikBavenstrand/DH2321-Spotify-Project */
var timeAnim;

// add global listener to change weeks and play animation
d3.select("body").on(
  "keydown",
  (function (keyThrottling) {
    return function () {
      // throttles keypresses to prevent buggy behavior
      // when holding down (except for space, must be responsive)
      if (keyThrottling && d3.event.keyCode != 32) return true;
      keyThrottling = true;
      setTimeout((function () {
        keyThrottling = false;
      }), 10);
      switch (d3.event.keyCode) {
        // spacebar press
        case 32:
          setTimeAnimPlaying(!isTimeAnimPlaying());
          break;
        // left key press
        case 37: // move one week back
          addTimeSliderValue(-1);
          break;
        // right key press
        case 39: // move one week forward
          addTimeSliderValue(1);
          break;
        default:
          break;
      }
    };
  })(false)
);

d3.select("#skipb-button").on("click", (function () {
  addTimeSliderValue(-1);
}));

d3.select("#skipf-button").on("click", (function () {
  addTimeSliderValue(1);
}));

d3.select("#play-pause-button").on("click", (function () {
  setTimeAnimPlaying(!isTimeAnimPlaying());
}));

function getTimeSliderValue() {
  return +sliderInput.property("value");
}

function setTimeSliderValue(value) {
  sliderInput.property("value", value);
  updateTimeSliderStyle(155 - value);
}

function isTimeAnimPlaying() {
  return timeAnim !== undefined;
}

function setTimeAnimPlaying(play) {
  if (!isTimeAnimPlaying() && getTimeSliderValue() == 155) {
    setTimeSliderValue(0);
  }

  d3.select("#play-icon").style("display", play ? "none" : "block");
  d3.select("#pause-icon").style("display", play ? "block" : "none");

  if (play) {
    if (!isTimeAnimPlaying()) {
      timeAnim = setInterval((function () {
        addTimeSliderValue(1);
        if (getTimeSliderValue() == 155) setTimeAnimPlaying(false);
      }), 600);
    }
  } else {
    if (isTimeAnimPlaying()) {
      clearInterval(timeAnim);
      timeAnim = undefined;
    }
  }
}

function addTimeSliderValue(dValue) {
  var newValue = getTimeSliderValue() + dValue;
  if (newValue < 0 || newValue > 155) return;
  sliderInput.property("value", newValue);
  updateTimeSliderStyle(newValue);
  sliderInput.dispatch("input");
}
