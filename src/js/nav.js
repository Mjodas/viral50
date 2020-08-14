function toggleDrawer() {
  var d = document.querySelector(".mdl-layout");
  d.MaterialLayout.toggleDrawer();
}

var overlay = document.getElementById("overlay");

var aboutModal = document.getElementById("about-modal");
var backgroundModal = document.getElementById("background-modal");
var teamModal = document.getElementById("team-modal");

var aboutButton = document.getElementById("about-button");
var backgroundButton = document.getElementById("background-button");
var teamButton = document.getElementById("team-button");

var aboutSpan = document.getElementsByClassName("about-close")[0];
var backgroundSpan = document.getElementsByClassName("background-close")[0];
var teamSpan = document.getElementsByClassName("team-close")[0];

aboutButton.onclick = function () {
  toggleDrawer();
  aboutModal.style.display = "block";
  overlay.style.display = "block";
};

backgroundButton.onclick = function () {
  toggleDrawer();
  backgroundModal.style.display = "block";
  overlay.style.display = "block";
};

teamButton.onclick = function () {
  toggleDrawer();
  teamModal.style.display = "block";
  overlay.style.display = "block";
};

aboutSpan.onclick = function () {
  aboutModal.style.display = "none";
  overlay.style.display = "none";
};

backgroundSpan.onclick = function () {
  backgroundModal.style.display = "none";
  overlay.style.display = "none";
};

teamSpan.onclick = function () {
  teamModal.style.display = "none";
  overlay.style.display = "none";
};

overlay.onclick = function (event) {
  console.log("overlay happening");
  aboutModal.style.display = "none";
  backgroundModal.style.display = "none";
  teamModal.style.display = "none";
  overlay.style.display = "none";
};
