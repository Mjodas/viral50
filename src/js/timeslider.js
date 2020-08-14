var sliderInput = d3.select(".slider");
var sliderLabels = d3.select(".slider-labels");

function loadTimeSlider() {
  var week_list = Object.keys(data_attrs)
    .filter(function (d, i) {
      if (d === "minimum" || d === "maximum") {
        return false;
      }
      // ensure a label for the first week of the data set
      if (i == Object.keys(data_attrs).length - 3) return true;
      //This was originally 10
      return i % 13 === 0;
    })
    .reverse();

  sliderLabels
    .selectAll("li")
    .data(week_list)
    .enter()
    .append("li")
    .text(function (d) {
      d3.select(this).attr("id", "week_" + weekToValue(d));
      var words = d.split("-");
      var month = parseInt(words[1], 10);
      var textMonth =
        month > 2 && month <= 5
          ? "Spring"
          : month > 5 && month <= 8
          ? "Summer"
          : month > 8 && month <= 11
          ? "Autumn"
          : (month > 11 && month <= 12) || (month >= 0 && month <= 2)
          ? "Winter"
          : "ERROR";
      return textMonth + " " + d.substring(2, 4);
    })
    .each(function (d) {
      var offset =
        (sliderInput.node().getBoundingClientRect().width *
          (155 - weekToValue(d))) /
          155 -
        (10 * (155 - weekToValue(d))) / 155;
      var labelWidth = d3.select(this).node().getBoundingClientRect().width;
      var thumbWidth = 10 / 2;
      offset = offset + thumbWidth - labelWidth / 2;
      d3.select(this).style("left", offset + "px");
    });

  sliderLabels
    .selectAll("li")
    .classed("active", true)
    .on("click", function (d) {
      sliderInput.property("value", 155 - weekToValue(d));
      updateTimeSliderStyle(weekToValue(d));
      sliderInput.dispatch("input");
    });

  //Default
  sliderLabels.selectAll("#week_0").classed("active selected", true);

  sliderInput.on("input", function () {
    updateTimeSliderStyle(155 - this.value);
    dataWeek = valueToWeek(155 - this.value);
    d3.select("#week-label").text("WEEK OF " + dataWeek);
    updateWorldMap(
      data_attrs[dataWeek],
      data_attrs.minimum,
      data_attrs.maximum
    );
    changeWeekDetailView();
  });

  // prevent double pressing and instead listen globally for keydown
  // but only preventdefault for the ones that are listened to globally
  sliderInput.on("keydown", function () {
    switch (d3.event.keyCode) {
      case 32:
      case 37:
      case 39:
        d3.event.preventDefault();
        break;
      default:
        break;
    }
  });

  sliderInput.style(
    "background",
    "linear-gradient(to right, #1ed760 0%, #1ed760 100%, #404040 100%, #404040 100%)"
  );

  sliderInput.dispatch("input");
}

function updateTimeSliderStyle(value) {
  sliderLabels
    .selectAll("li")
    .classed("active selected", false)
    .filter(function (d) {
      return value <= weekToValue(d);
    })
    .classed("active", true);
  d3.select("#week_" + value).classed("active selected", true);

  var percent = (100 * (155 - value)) / 155;

  sliderInput.style(
    "background",
    "linear-gradient(to right, #1ed760 0%, #1ed760 " +
      percent +
      "%, #404040 " +
      percent +
      "%, #404040 100%)"
  );
}
