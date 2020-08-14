/*! viral-50 v0.0.1 | (c) 2020 Erik Båvenstrand | MIT License | https://github.com/ErikBavenstrand/DH2321-Spotify-Project */
var selectedSongs = [];
var globalSelected = false;

// map containing the song:colorIdx relation
var songToColorMap = {};
// all available colors for selected songs
var songColors = ["#40c990", "#845f80", "#ee840e"];
var usedSongColors = [];
// initialize colors to unused
songColors.forEach((function () {
  usedSongColors.push(false);
}));

var invertChip = [false, true, false, true, false, true];

var lastDataWeek = 0;

var clickedLink = false;

function addCountryToDetailView(CC) {
  addCountryToWeeklySongs(CC);
  addCountryToLineChart(CC);
  addCountryLegendChip(CC);
  generateAttrBarChart();
}

function removeCountryFromDetailView(CC) {
  removeCountryFromWeeklySongs(CC);
  removeCountryFromLineChart(CC);
  removeCountryLegendChip(CC);
  dehighlight();
  generateAttrBarChart();
}

function changeWeekDetailView() {
  selectedCountries.forEach((function (CC) {
    changeWeeklySongsWeek(CC);
  }));
  if (isInDetailView) changeLineChartWeek();
  generateAttrBarChart();
  // update tooltip if changing week on worldmap
  if (!isInDetailView && tooltipRecent) showCountryTooltip(tooltipCC);
}

function addCountryToWeeklySongs(CC) {
  var songListNav = d3.select("#weekly-songs-list");

  songListNav
    .append("li")
    .attr("id", "weekly-songs-" + CC)
    .append("div")
    .attr("id", "weekly-songs-div-" + CC)
    .data([CC])
    .text((function () {
      return countryCCJSON[CC];
    }))
    .on("click", (function (d) {
      songListNav.selectAll("div").classed("active", false);
      d3.select(this).classed("active", true);
      d3.selectAll(".song-entry-wrapper").each((function (d) {
        var songAsKey = JSON.stringify(d);
        if (selectedSongs.includes(songAsKey)) {
          d3.select(this)
            .classed("selected-song", true)
            .insert("span", ":first-child")
            .attr("class", "before-selected-song")
            .style("background-color", getSongColor(songAsKey));
        }
      }));

      if (selectedSongs.length === 3) {
        d3.selectAll(".song-entry-wrapper").each((function () {
          d3.select(this.parentNode).classed("noSelect", true);
        }));
        d3.selectAll(".selected-song").each((function () {
          d3.select(this.parentNode).classed("noSelect", false);
        }));
      }
      d3.selectAll(".weekly-song-list-wrapper").classed(
        "weekly-song-list-wrapper-hidden",
        true
      );
      d3.select("#weekly-song-tab-" + d).classed(
        "weekly-song-list-wrapper-hidden",
        false
      );
    }));

  d3.select("#weekly-songs-list-window")
    .append("div")
    .classed("weekly-song-list-wrapper", true)
    .classed("weekly-song-list-wrapper-hidden", true)
    .attr("id", "weekly-song-tab-" + CC)
    .append("div")
    .classed("weekly-song-list", true)
    .append("ol")
    .attr("id", "weekly-song-list-ul-" + CC);

  if (songListNav.selectAll("li").size() === 1) {
    d3.select("#weekly-songs-div-" + CC).classed("active", true);
    d3.select("#weekly-song-tab-" + CC).classed(
      "weekly-song-list-wrapper-hidden",
      false
    );
  }

  changeWeeklySongsWeek(CC);
}

function removeCountryFromWeeklySongs(CC) {
  var songListNav = d3.select("#weekly-songs-list");
  d3.select("#weekly-songs-" + CC).remove();
  d3.select("#weekly-song-tab-" + CC).remove();
  var activesLeft = false;
  songListNav.selectAll("div").each((function () {
    if (d3.select(this).classed("active")) activesLeft = true;
  }));
  if (selectedCountries.length > 0) {
    if (!activesLeft) {
      songListNav.select("div").classed("active", true);
      d3.select("#weekly-songs-list-window")
        .select("div")
        .classed("weekly-song-list-wrapper-hidden", false);
    }
  }
}

function changeWeeklySongsWeek(CC) {
  if (dataWeek != lastDataWeek) {
    lastDataWeek = dataWeek;
    //clearSelectedSongs(); // uncommented to allow comparing songs over time
    // call the clearSelectedSongs-function on a button press of "clear all songs" instead
  }
  d3.select("#weekly-song-list-ul-" + CC)
    .selectAll("li")
    .remove();
  if (data_songs[dataWeek][CC]) {
    var songList = d3.select("#weekly-song-list-ul-" + CC);
    songList
      .selectAll("li")
      .data(data_songs[dataWeek][CC])
      .enter()
      .append("li")
      .append("div")
      .classed("song-entry-wrapper", true)
      .each((function (d) {
        var songAsKey = JSON.stringify(d);
        if (selectedSongs.includes(songAsKey)) {
          d3.select(this).select("span").remove();
          d3.select(this)
            .classed("selected-song", true)
            .insert("span", ":first-child")
            .attr("class", "before-selected-song")
            .style("background-color", getSongColor(songAsKey));
        }
      }))
      .on("mouseover", (function (d) {
        var songAsKey = JSON.stringify(d);
        if (selectedSongs.includes(songAsKey))
          highlight(getStyleFriendlySongString(songAsKey));
      }))
      .on("mouseout", (function () {
        dehighlight();
      }))
      .on("click", (function (d) {
        if (clickedLink) {
          clickedLink = false;
          return;
        }
        // convert the song data to a string for consistent comparison
        var songAsKey = JSON.stringify(d);
        if (selectedSongs.includes(songAsKey)) {
          deselectSong(d);
        } else {
          if (selectedSongs.length < 3) {
            // find an unused color for the song and save the mapping
            getSongColor(songAsKey);
            selectedSongs.push(songAsKey);
            addSongLegendChip(d);
            d3.select(this).classed("selected-song", true);
            generateAttrBarChart();
            highlight(getStyleFriendlySongString(songAsKey));
          }
        }
        // clear previous color markers
        d3.select(this).select("span").remove();
        // add new color marker
        if (selectedSongs.includes(songAsKey)) {
          d3.select(this)
            .insert("span", ":first-child")
            .attr("class", "before-selected-song")
            .style("background-color", getSongColor(songAsKey));
        }
        d3.select("#weekly-songs-selected").text((function () {
          return "(" + selectedSongs.length + "/3";
        }));

        if (selectedSongs.length === 3) {
          d3.selectAll(".song-entry-wrapper").each((function () {
            d3.select(this.parentNode).classed("noSelect", true);
          }));
          d3.selectAll(".selected-song").each((function () {
            d3.select(this.parentNode).classed("noSelect", false);
          }));
        } else {
          d3.selectAll(".song-entry-wrapper").each((function () {
            d3.select(this.parentNode).classed("noSelect", false);
          }));
        }
      }))
      .append("div")
      .classed("song-name", true)
      .text((function (d) {
        pos =
          data_songs[dataWeek][CC].map((function (e) {
            return e["Track Name"];
          })).indexOf(d["Track Name"]) + 1;
        return pos + ". " + d["Track Name"];
      }));

    songList
      .selectAll(".song-entry-wrapper")
      .data(data_songs[dataWeek][CC])
      .append("div")
      .classed("artist-name", true)
      .text((function (d) {
        return d.Artist;
      }));

    songLink = songList
      .selectAll(".song-entry-wrapper")
      .data(data_songs[dataWeek][CC])
      .append("a")
      .classed("spotify-link", true)
      .text("Spotify")
      .attr("href", (function (d) {
        return d.URL;
      }))
      .attr("target", "_blank")
      .on("click", (function (d) {
        clickedLink = true;
      }));
    // add fontawesome's icon for external links
    songLink.append("i").attr("class", "fas fa-external-link-alt");
    if (selectedSongs.length === 3) {
      d3.selectAll(".song-entry-wrapper").each((function () {
        d3.select(this.parentNode).classed("noSelect", true);
      }));
      d3.selectAll(".selected-song").each((function () {
        d3.select(this.parentNode).classed("noSelect", false);
      }));
    } else {
      d3.selectAll(".song-entry-wrapper").each((function () {
        d3.select(this.parentNode).classed("noSelect", false);
      }));
    }
  } else {
  }
}

function deselectSong(song) {
  var songAsKey = JSON.stringify(song);
  removeSongLegendChip(songAsKey);
  d3.selectAll(".song-entry-wrapper")
    .filter((function (d) {
      return JSON.stringify(d) === songAsKey;
    }))
    .classed("selected-song", false)
    .selectAll("span")
    .remove();

  d3.selectAll(".selected-song").each((function (d) {
    var songAsKeyComp = JSON.stringify(d);
    if (songAsKeyComp === songAsKey) {
      d3.select(this)
        .classed("selected-song", false)
        .selectAll("span")
        .remove();
    }
  }));

  selectedSongs.splice(selectedSongs.indexOf(songAsKey), 1);
  clearSongColor(songAsKey);
  generateAttrBarChart();

  d3.select("#weekly-songs-selected").text((function () {
    return "(" + selectedSongs.length + "/3";
  }));

  // remove filtering opacities
  dehighlight();
}

function deselectCountry(CC) {
  selectedCountries.splice(selectedCountries.indexOf(CC), 1);
  d3.select("#country-list-" + CC).style("color", null);
  if (selectedCountries.length == 0) {
    zoomOutCountryHideDetail(CC);
    setTimeout(removeCountryFromDetailView, 1000, [CC]);
  } else {
    removeCountryFromDetailView(CC);
  }
}

function clearSelectedSongs() {
  selectedSongs = [];
  songToColorMap = {};
  usedSongColors = [];
  songColors.forEach((function () {
    usedSongColors.push(false);
  }));
  d3.selectAll(".song-chip-bg").remove();

  /*
  d3.select(".weekly-song-list")
    .select("ol")
    .selectAll("li")
    .classed("noSelect", false);
    */
  d3.selectAll(".song-entry-wrapper").each((function () {
    d3.select(this.parentNode).classed("noSelect", false);
  }));

  d3.select("#weekly-songs-selected").text((function () {
    return "(" + selectedSongs.length + "/3";
  }));
}

function getSongColor(songAsKey) {
  // if the song already has a color, return its index
  if (typeof songToColorMap[songAsKey] !== "undefined")
    return songColors[songToColorMap[songAsKey]];

  // find an available color (index)
  var colorIdx;
  usedSongColors.some((function (d, i) {
    // save any one that is free
    if (!d) {
      colorIdx = i;
    }
    return !d; // exit once one is found
  }));
  // update the bool array and song:colorIdx map
  usedSongColors[colorIdx] = true;
  songToColorMap[songAsKey] = colorIdx;
  // return the color
  return songColors[colorIdx];
}

function clearSongColor(songAsKey) {
  // set the color to unused/available
  usedSongColors[songToColorMap[songAsKey]] = false;
  // remove the mapping from the song:colorIdx map
  delete songToColorMap[songAsKey];
}

function generateAttrBarChart() {
  var attrs = [
    "danceability",
    "energy",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
  ];

  var countriesWithData = selectedCountries.filter((function (d) {
    return data_attrs[dataWeek][d] != undefined;
  }));

  var m = attrs.length;
  var n = countriesWithData.length + selectedSongs.length + globalLine.length;

  // get the attribute data for each country, song and global selected
  var data = d3.range(n).map((function (i) {
    return d3.range(m).map((function (j) {
      var selCs = countriesWithData.length;
      var selSo = selectedSongs.length;
      if (i < countriesWithData.length)
        return data_attrs[dataWeek][countriesWithData[i]][attrs[j]];
      else if (i - selCs < selSo)
        return JSON.parse(selectedSongs[i - selCs])[attrs[j]];
      else return data_attrs[dataWeek].GLO[attrs[j]];
    }));
  }));

  // set dimensions of bar chart
  var margin = { top: 20, right: 30, bottom: 30, left: 40 };
  var width =
    d3.select("#attr-barchart-wrapper").node().getBoundingClientRect().width -
    margin.left -
    margin.right;
  var height =
    d3.select("#attr-barchart-wrapper").node().getBoundingClientRect().height -
    margin.top -
    margin.bottom;

  // set up x- and y-axis with scales
  var y = d3.scaleLinear().domain([0, 1]).range([height, 0]);

  var x0 = d3.scaleBand().domain(d3.range(m)).range([0, width], 0.2);

  var x1 = d3
    .scaleBand()
    .domain(d3.range(n))
    .range([0, x0.bandwidth() - 30]);

  var selCs = countriesWithData.length;
  var selSo = selectedSongs.length;
  var colors = function (i) {
    // the color is for a country
    if (i < selCs) {
      var colorIdx = chartCountryLines[i].color;
      return countryColors[colorIdx];
    }
    // The color is for a song
    else if (i - selCs < selSo) return getSongColor(selectedSongs[i - selCs]);
    // The color is for global
    else return "#fff";
  };

  // remove previous version of bar chart
  d3.select("#attr-barchart-wrapper").selectAll("svg").remove();

  // recreate the container
  var svg = d3
    .select("#attr-barchart-wrapper")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // add y-axis
  svg.append("g").call(d3.axisLeft(y)).classed("y axis", true);

  // format the tick text
  svg
    .selectAll("g.tick")
    .filter((function (d) {
      if (attrs.indexOf(d3.select(this).text()) > -1) {
        return true;
      }
    }))
    .select("text")
    .classed("attribute-text", true);

  // create light gridlines in the background
  var yTicks = svg.selectAll(".y.axis > .tick");
  yTicks.each((function () {
    var l = d3
      .create("svg:line")
      .attr("class", "y-gridline")
      .attr("x1", 0)
      .attr("x2", innerWidth);
    this.append(l.node());
  }));

  // add the bars themselves and style according to its category
  var id = d3.local();
  svg
    .append("g")
    .selectAll("g")
    .data(data)
    .enter()
    .append("g")
    .attr("class", (function (barData, i) {
      if (i >= selCs) {
        if (globalSelected && i === data.length - 1) {
          return "";
        } else {
          // get all the song data to decide which should be inverted
          songAttrs = selectedSongs.map((function (d2) {
            // array to fill
            attrArray = [];
            // convert the string into an object
            d2 = JSON.parse(d2);
            // filter out the attributes used in barchart
            Object.keys(d2).forEach((function (key) {
              if (attributes.indexOf(key) !== -1) attrArray.push(d2[key]);
            }));
            return attrArray;
          }));

          var k = -1;
          // find the index of the data in selectedSongs
          for (var j = 0; j < songAttrs.length; j++) {
            filtered = songAttrs[j].filter((function (d2, i) {
              return d2 == barData[i];
            }));
            if (songAttrs[j].length == filtered.length) k = j;
          }
          // get the index for the song's color in songColors
          var colorIdx = songToColorMap[selectedSongs[k]];
          // return class of the bar based on its invert status
          if (invertChip[3 + colorIdx])
            return "song-bar-container song-bar-inverted";
          else return "song-bar-container song-bar-normal";
        }
      }
    }))
    .style("fill", (function (d, i) {
      if (i < selCs) id.set(this, selectedCountries[i]);
      else if (i - selCs < selSo)
        id.set(this, getStyleFriendlySongString(selectedSongs[i - selCs]));
      else id.set(this, "GLO");
      return colors(i);
    }))
    .attr("transform", (function (d, i) {
      return "translate(" + x1(i) + ",0)";
    }))
    .selectAll("rect")
    .data((function (d) {
      return d;
    }))
    .enter()
    .append("rect")
    .attr("class", (function (d) {
      return "chart-element chart-nonline chart-element-" + id.get(this);
    }))
    .attr("width", x1.bandwidth())
    .attr("height", (function (d) {
      return y(1 - d);
    }))
    .attr("x", (function (d, i) {
      return x0(i);
    }))
    .attr("y", (function (d) {
      return height - y(1 - d);
    }));

  // add stripes to bars belonging to songs
  svg
    .selectAll(".song-bar-container")
    .selectAll("span")
    .data((function (d) {
      return d;
    }))
    .enter()
    .append("foreignObject")
    .classed("song-bar-stripes", true)
    .attr("width", x1.bandwidth())
    .attr("height", (function (d) {
      return y(1 - d);
    }))
    .attr("x", (function (d, i) {
      return x0(i);
    }))
    .attr("y", (function (d) {
      return height - y(1 - d);
    }));

  // add x-axis with attribute labels
  svg
    .append("g")
    .attr("transform", "translate(-15," + height + ")")
    .call(
      d3.axisBottom(x0).tickFormat((function (d) {
        // first letter capitalized
        var formatted = attrs[d][0].toUpperCase() + attrs[d].slice(1);
        return formatted;
      }))
    )
    .classed("x axis", true);
}

d3.select("#legend-return-label")
  .insert("i", ":first-child")
  .attr("class", "fas fa-chevron-left");

d3.select("#close-detail").on("click", (function (d) {
  var tmpList = selectedCountries.slice(0);
  tmpList.forEach((function (CC) {
    selectedCountries.splice(selectedCountries.indexOf(CC), 1);
    d3.select("#country-list-" + CC).style("color", null);
    setTimeout(removeCountryFromDetailView, 1000, [CC]);
    setTimeout(clearSelectedSongs, 1000);
    checkToggleListClickability();
  }));
  zoomOutCountryHideDetail(tmpList[0]);
}));

/* Functions and code for showing global
    data in linechart and barchart */
function toggleGlobalLineDetailView() {
  toggleGlobalLine();
  globalSelected = !globalSelected;
  generateAttrBarChart();
  if (globalSelected) highlight("GLO");
  else dehighlight();
}

var globalContainer = d3
  .select(".Detail__legend-to-plots")
  .select("#global-checkbox")
  .classed("global-checkbox-div", true)
  .classed("chart-element", true)
  .classed("chart-element-GLO", true)
  .on("mouseover", (function () {
    if (globalSelected) highlight("GLO");
  }))
  .on("mouseout", (function () {
    dehighlight();
  }))
  .append("label")
  .attr("for", "globalCheck")
  .attr("class", "mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect");

var globalCheckbox = globalContainer
  .append("input")
  .attr("type", "checkbox")
  .attr("id", "globalCheck")
  .classed("mdl-checkbox__input", true)
  .on("change", toggleGlobalLineDetailView);

globalContainer
  .append("span")
  .classed("global-checkbox-label", true)
  .classed("mdl-checkbox__label", true)
  .text("Global");

/* Functions and code for the legend (chips) */
function addCountryLegendChip(CC) {
  var color =
    countryColors[chartCountryLines[selectedCountries.indexOf(CC)].color];
  var shouldInvertChip = invertChip[countryColors.indexOf(color)];
  var chip = d3
    .select("#country-legend-wrapper")
    .append("div")
    .attr("id", "legend-chip-" + CC)
    .classed("legend-chip", true)
    .classed("chip-inverted", shouldInvertChip)
    .classed("country-chip", true)
    .classed("chart-element", true)
    .classed("chart-element-" + CC, true)
    .style("background", color)
    .on("mouseover", (function () {
      highlight(CC);
    }))
    .on("mouseout", (function () {
      dehighlight();
    }));

  chip.append("div").classed("legend-chip-label", true).text(countryCCJSON[CC]);

  chip
    .append("div")
    .classed("legend-chip-remove", true)
    .classed("chip-remove-inverted", shouldInvertChip)
    .text("×")
    .on("click", (function () {
      deselectCountry(CC);
    }));
}

function removeCountryLegendChip(CC) {
  d3.select("#legend-chip-" + CC).remove();
  d3.select("#country-list-ul").selectAll("li").classed("noSelect", false);
}

function addSongLegendChip(song) {
  var songAsKey = JSON.stringify(song);
  var color = getSongColor(songAsKey);
  // +3 because countries occupy first 3 indices in invertChip
  var shouldInvertChip = invertChip[songToColorMap[songAsKey] + 3];

  var chip = d3
    .select("#song-legend-wrapper")
    .append("div")
    .attr("id", "legend-chip-" + getStyleFriendlySongString(songAsKey))
    .style("background", color)
    .classed("chart-element", true)
    .classed("chart-element-" + getStyleFriendlySongString(songAsKey), true)
    .classed("song-chip-bg", true)
    .append("div")
    .classed("legend-chip", true)
    .classed("chip-normal", !shouldInvertChip)
    .classed("chip-inverted", shouldInvertChip)
    .classed("song-chip", true)
    .on("mouseover", (function () {
      highlight(getStyleFriendlySongString(songAsKey));
    }))
    .on("mouseout", (function () {
      dehighlight();
    }));

  chip
    .append("div")
    .classed("legend-chip-label", true)
    .text(song["Track Name"]);

  chip
    .append("div")
    .classed("legend-chip-remove", true)
    .classed("chip-remove-inverted", shouldInvertChip)
    .text("×")
    .on("click", (function () {
      deselectSong(song);
    }));
}

function removeSongLegendChip(song) {
  d3.select("#legend-chip-" + getStyleFriendlySongString(song)).remove();
  d3.selectAll(".song-entry-wrapper").each((function () {
    d3.select(this.parentNode).classed("noSelect", false);
  }));
  /*
  d3.select(".weekly-song-list")
    .select("ol")
    .selectAll("li")
    .classed("noSelect", false);
    */
}

function getStyleFriendlySongString(song) {
  var result = "";
  for (var i = 0; i < song.length; ++i) {
    var c = song.charAt(i);
    if (c.match(/^[0-9A-Za-z]+$/)) {
      result += c;
    }
  }
  return result;
}

function highlight(key) {
  // special treatment for chart dots
  d3.selectAll(".chart-dot").style("opacity", (function () {
    var op = d3.select(this).classed("focus") ? 0.8 : 0.5;
    return d3.select(this).classed("chart-element-" + key) ? op : 0.1;
  }));

  // all the other elements that belong to the charts
  var elements = d3.selectAll(".chart-element");
  // unfocused
  elements
    .filter((function () {
      return !d3.select(this).classed("chart-element-" + key);
    }))
    .style("opacity", 0.2)
    // the stripes are siblings to its bar => accessed via parent
    .each((function () {
      d3.select(this.parentNode)
        .selectAll(".song-bar-stripes")
        .style("opacity", 0.2);
    }));
  // focused
  elements
    .filter((function () {
      return d3.select(this).classed("chart-element-" + key);
    }))
    .style("opacity", 1)
    // the stripes are siblings to its bar => accessed via parent
    .each((function () {
      d3.select(this.parentNode)
        .selectAll(".song-bar-stripes")
        .style("opacity", 1);
    }));
}

function dehighlight() {
  d3.selectAll(".chart-element").style("opacity", 1);
  d3.selectAll(".chart-dot.focus").style("opacity", 0.8);
  d3.selectAll(".chart-dot.nonfocus").style("opacity", 0.5);
  d3.selectAll(".song-bar-stripes").style("opacity", 1);
}
