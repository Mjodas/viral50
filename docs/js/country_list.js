/*! viral-50 v0.0.1 | (c) 2020 Erik Båvenstrand | MIT License | https://github.com/ErikBavenstrand/DH2321-Spotify-Project */
function loadCountryList(data, cNames) {
  list = d3.select("#country-list-ul");
  list.selectAll(".country-list-item").remove();

  countries = Object.keys(data);
  countries.splice(countries.indexOf("GLO"), 1);

  /* Create li items */
  list
    .selectAll("li")
    .data(countries)
    .enter()
    .append("li")
    .classed("country-list-item", true)
    .attr("id", (function (d) {
      return "country-list-" + d;
    }))
    .on("click", (function (d) {
      if (isInDetailView === false) {
        handleCountryClickShowDetail(d);
      }
      countryClickSelection(d);
      checkToggleListClickability();
      if (selectedCountries.includes(d)) highlight(d);
      else dehighlight();
    }))
    .on("mouseover", (function (d, i) {
      highlightCountryOnMap(d, true);
      if (selectedCountries.includes(d)) highlight(d);
    }))
    .on("mouseout", (function (d, i) {
      highlightCountryOnMap(d, false);
      dehighlight();
    }));

  /* Insert span into li */
  list
    .selectAll("li")
    .data(countries)
    .append("span")
    .attr("class", "country-code-list")
    .text((function (d) {
      return cNames[d];
    }));

  var options = {
    valueNames: ["country-code-list"],
  };
  var countryList = new List("list-wrapper", options);
  countryList.sort("country-code-list", {
    order: "asc",
  });
}

function highlightCountryInList(CC, highlit) {
  list.select("#country-list-" + CC).classed("highlit-country", highlit);

  if (highlit) {
    try {
      d3.select("#country-list-" + CC)
        .node()
        .scrollIntoView({
          block: "start",
          behavior: "smooth",
        });
    } catch (error) {
      /*
      Prevents logging error when hovering
      countries outside search results*/
    }
  }
}

function checkToggleListClickability() {
  if (selectedCountries.length == 3) {
    d3.select("#country-list-ul")
      .selectAll("li")
      .each((function (d) {
        if (selectedCountries.indexOf(d) === -1) {
          d3.select(this).classed("noSelect", true);
        }
      }));
  } else {
    d3.select("#country-list-ul")
      .selectAll("li")
      .each((function (d) {
        if (selectedCountries.indexOf(d) === -1) {
          d3.select(this).classed("noSelect", false);
        }
      }));
  }
}
