/*! viral-50 v0.0.1 | (c) 2020 Erik Båvenstrand | MIT License | https://github.com/ErikBavenstrand/DH2321-Spotify-Project */
var legendLabels = {
  acousticness: ["Electronic music", "Acoustic music"],
  danceability: ["Low danceability", "High danceability"],
  energy: ["Calm music", "Energetic music"],
  instrumentalness: ["Vocal tracks", "Instrumental tracks"],
  liveness: ["Studio recorded", "Live audience"],
  speechiness: ["Low speechiness", "High speechiness"],
  valence: ["Negative tone", "Positive tone"],
};

function updateLegend(data, minimum, maximum) {
  var labels = legendLabels[currentAttribute];
  var min = minimum[currentAttribute];
  var max = maximum[currentAttribute];
  var c1 = calculateColorFromValue(min, min, max, minColor, maxColor);
  var c2 = calculateColorFromValue(max, min, max, minColor, maxColor);
  var continuous = labels.length == 2;

  d3.select("#legend-label-container").selectAll("div").remove();

  d3.select("#legend-label-container")
    .selectAll("div")
    .data(labels)
    .enter()
    .append("div")
    .attr("class", "legend-label")
    .style("text-align", (function (d) {
      if (continuous) return labels.indexOf(d) == 0 ? "left" : "right";
      return "center";
    }))
    .text((function (d) {
      var value = "";
      if (continuous) {
        value =
          " (" +
          (labels.indexOf(d) == 0 ? min.toFixed(2) : max.toFixed(2)) +
          ") ";
        return labels.indexOf(d) == 0 ? value + d : d + value;
      }
      return d;
    }));

  d3.select("#legend-scale-container").selectAll("div").remove();

  d3.select("#legend-scale-container").attr(
    "style",
    "background-image: linear-gradient(to right," + c1 + "," + c2 + ")"
  );

  if (!continuous) {
    var values = Array(labels.length);
    for (var i = 0; i < values.length; ++i) {
      values[i] = i;
    }

    d3.select("#legend-scale-container")
      .selectAll("div")
      .data(values)
      .enter()
      .append("div")
      .attr("class", "legend-scale-segment")
      .style("background", (function (d) {
        return calculateColorFromValue(
          d,
          0,
          values.length - 1,
          minColor,
          maxColor
        );
      }));
  }
}
