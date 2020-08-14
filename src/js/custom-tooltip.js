function loadTooltip() {
  d3.select("#attribute-ul").append("span").classed("tooltip-content", true);

  var attr = d3
    .select("#attribute-ul")
    .selectAll("li")
    .on("mouseover", function () {
      hoverTooltip(this);
    })
    .on("mouseout", function (d) {
      leaveTooltip(this);
    });
}

function hoverTooltip(ele) {
  var tooltipContent = getTooltipContent(ele.innerHTML);
  var tooltip = document.getElementsByClassName("tooltip-content")[0];
  tooltip.innerHTML = tooltipContent;
  tooltip.style.visibility = "visible";
  alignTooltip(ele, tooltip);
}

function leaveTooltip() {
  var tooltip = document.getElementsByClassName("tooltip-content")[0];
  tooltip.style.visibility = "hidden";
}

function alignTooltip(ele, tooltip) {
  tooltip.style.top =
    ele.offsetTop + ele.clientHeight / 2 - tooltip.clientHeight / 2 + "px";
  tooltip.style.left = ele.clientWidth + 5 + "px";
}

function getTooltipContent(string) {
  var tooltipText = "";
  switch (string) {
    case "acousticness":
      tooltipText = "A confidence measure whether the track is acoustic.";
      break;
    case "danceability":
      tooltipText =
        "Danceability describes how suitable a track is for dancing.";
      break;
    case "energy":
      tooltipText =
        "Energy is a measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy.";
      break;
    case "instrumentalness":
      tooltipText = "A measure of whether a track contains no vocals.";
      break;
    case "liveness":
      tooltipText = "Measures the presence of an audience in the recording.";
      break;
    case "speechiness":
      tooltipText =
        "Speechiness detects the presence of spoken words in a track.";
      break;
    case "valence":
      tooltipText = "A measure of musical positiveness conveyed by a track.";
      break;
    default:
      tooltipText = "Something went wrong...";
  }
  return tooltipText;
}
