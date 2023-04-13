let d3 = window.d3;
let max = 2;
let xScale;

var foodCategories = ['Bread - Retail', 'Rice (low quality) - Retail', 'Rice (high quality) - Retail',
'Meat (chicken) - Retail', 'Eggs - Retail', 'Milk - Retail', 'Meat (beef) - Retail',
'Meat (pork) - Retail', 'Meat (lamb) - Retail','Fish (frozen) - Retail', 'Carrots - Retail', 
'Onions - Retail', 'Potatoes - Retail', 'Beans - Retail', 'Salt - Retail',
'Apples (red) - Retail', 'Tomatoes - Retail', 'Oranges - Retail', 'Wheat - Retail',
'Bread (wheat) - Retail', 'Oil (vegetable) - Retail', 'Oil (sunflower) - Retail', 
'Sugar (white) - Retail', 'Cabbage - Retail', 'Garlic - Retail', 'Sugar (local) - Retail', 
'Pasta - Retail', 'Cucumbers - Retail', 'Wheat flour (first grade) - Retail', 
'Walnuts - Retail', 'Peas - Retail', 'Tea (black) - Retail'];

let yearsArray = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
let startYear = yearsArray[0];
let endYear = yearsArray.pop();

var foods = [];
var countries = [];
var cities = [];

let firstLoad = true;

// filtered years
let filteredYears = yearsArray.filter(function(year) {
  return year >= startYear && year <= endYear;
});

// defaulted selected country and city
let selectedCountry = "Afghanistan";
let selectedCity = "Hirat";

let colorScale = d3.scaleOrdinal()
.domain(['Apples (red) - Retail'], ['Beans - Retail'], ['Bread (wheat) - Retail'], ['Bread - Retail'], ['Cabbage - Retail'], ['Carrots - Retail'], ['Cucumbers - Retail'], ['Eggs - Retail'], ['Fish (frozen) - Retail'], ['Garlic - Retail'], ['Meat (beef) - Retail'], ['Meat (chicken) - Retail'], ['Meat (lamb) - Retail'], ['Meat (pork) - Retail'], ['Milk - Retail'], ['Oil (sunflower) - Retail'], ['Oil (vegetable) - Retail'], ['Onions - Retail'], ['Oranges - Retail'], ['Pasta - Retail'], ['Peas - Retail'], ['Potatoes - Retail'], ['Rice (high quality) - Retail'], ['Rice (low quality) - Retail'], ['Salt - Retail'], ['Sugar (local) - Retail'], ['Sugar (white) - Retail'], ['Tea (black) - Retail'], ['Tomatoes - Retail'], ['Walnuts - Retail'], ['Wheat - Retail'], ['Wheat flour (first grade) - Retail'])
.range(d3.schemeCategory10);

const MARGIN = {
  LEFT: 100,
  RIGHT: 100,
  TOP: 100,
  BOTTOM: 200,
};

const width = 1600,
  height = 800;

var _lineGraph; //define a global reference for line plot

window.onload = function () {
  foodSelect(document.getElementById('foodPicker'));
  countrySelect(document.getElementById('countryPicker'));

  var label = document.getElementById('year-label');

   // Get the query string from the URL
   let queryString = window.location.search;

   // Remove the '?' character from the beginning of the query string
   queryString = queryString.substring(1);

   // Split the query string into an array of parameter-value pairs
   let params = queryString.split('&');

   // Loop through the parameter-value pairs and extract the parameter value you need
   for (let i = 0; i < params.length; i++) {
     let param = params[i].split('=');
     if (param[0] === 'country') {
       selectedCountry = param[1];
     }
     else if (param[0] === 'city') {
      selectedCity = param[1];
     }
   }

   $("select").selectpicker();
   $("select[name=countryPicker]").val(selectedCountry);
   $("select[name=countryPicker]").selectpicker('refresh');
  
  const country = document.getElementById("countryPicker").value;
  const cityDropdown = document.getElementById("marketPicker");
  cityDropdown.innerHTML = "<option value=''>--Select City--</option>";
  if (country) {
    const cities = citiesByCountry[country];
    cities.forEach(city => {
      const option = document.createElement("option");
      option.value = city;
      option.text = city;
      if(city == selectedCity)
        option.selected = true;
      cityDropdown.appendChild(option);
    });
  }

  $('#marketPicker').selectpicker('refresh');

  countries = [];
  countries.push(selectedCountry);
  citySelect(document.getElementById('marketPicker'));

};

setup = function() {
  // parse csv file by country and city 
  d3.csv(global_prices_csv).then(function (d) {
    filteredYears = yearsArray.filter(function(year) {
      return year >= startYear && year <= endYear;
    });

    // filter out years 
    d = d.filter((i) => {
      return i.mp_month == 1 && i.mp_year <= endYear && i.mp_year >= startYear && cities.includes(i.CityName) && countries.includes(i.CountryName);
    });

    if (foods == undefined || countries == undefined || cities == undefined) d = [];
    else if (foods.length == 0 || countries.length == 0  || cities.length == 0 ) d = [];
    
    max = d3.max(d, function(d) { return +d.mp_price; });

    _lineGraph = new updateLineGraph(d);
    _lineGraph.drawChart();
    _lineGraph.drawAxis();
  });
}

function updateLineGraph(data) {
  var svg = d3.select("#MAIN svg");
  // x scale will contain years
  xScale = d3
    .scaleBand()
    .domain(filteredYears) 
    .range([MARGIN.LEFT, width - MARGIN.RIGHT]);

  // y scale will contain price
  let yScale = d3
    .scaleLinear()
    .domain([0, max])
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  let chart = svg.append("g").attr("class", "lineChart");
  var yAxis = d3.axisLeft().scale(yScale);

  // draw axis function
  this.drawAxis = function() {
    // draw y-axis
    chart
      .append("g")
      .attr("transform", "translate(" + MARGIN.LEFT + "," + 0 + ")")
      .call(yAxis);

    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues(yearsArray)
      .ticks(5);

    // draw x-axis
    chart.append("g")
      .attr("transform","translate(" + 0 + "," + (height - MARGIN.BOTTOM) + ")")
      .attr("class", "xAxis")
      .call(xAxis);

    // Create SVG element for x-axis label
    svg.append("text")
      .style("font-size", "20px")
      .style("fill", "gainsboro")
      .style("font-family", "Helvetica")
      .attr("class", "x-axis-label")
      .attr("text-anchor", "middle")
      .attr("transform", "translate(" + (width/2) + "," + (height + MARGIN.BOTTOM - 300) + ")")
      .text("Years");

    // Create SVG element for y-axis label
    svg.append("text")
      .attr("class", "y-axis-label")
      .style("fill", "gainsboro")
      .style("font-family", "Helvetica")
      .style("font-size", "20px")
      .attr("text-anchor", "middle")
      .attr("transform", "rotate(-90)")
      .attr("y", MARGIN.LEFT-60)
      .attr("x", 50 - (height / 2))
      .attr("dy", "1em")
      .text("Price in CAD ($)");
      const scale = 10;
  }

  // draw line chart function
  this.drawChart = function () {
    // data filtered by food selection
    filteredByFood = data.filter(i => {
        if (foods.includes(i.FoodName)) { 
          console.log(i.FoodName)
          return foods; 
        }
    });

    console.log(filteredByFood, foods)
    // draw points
    let circles = chart.selectAll("circle")
    .data(filteredByFood)
    .enter()
    .append("circle")
    // .attr("stroke", "gainsboro")
    .attr("fill", (d)=>colorScale(d.FoodName))
    .attr("cx", function (d) { return xScale(d.mp_year) + xScale.bandwidth() / 2; })
    .attr("cy", (d) => {return yScale(d.mp_price);})
    .attr("r", 5)
    .style("opacity",1);

    var subdata = [];
    var i =0;
    // console.log("DRAWINNG LINE", foodCategories)
    foodCategories.forEach(function (foodCategory) {
      newdata = filteredByFood.filter((i) => { return i.mp_year <= endYear && i.mp_year >= startYear; });
      subdata2 = filteredByFood.filter((ss) => { return ss.FoodName == foodCategory; });
      cities.forEach(element => { 
        subdata = subdata2.filter((ss) => { return ss.CityName == element; 
      });
      subdata.sort((a,b) => a.mp_year - b.mp_year);
  
      // Plot line
      var line = d3
        .line()
        .x((d) => xScale(d.mp_year) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.mp_price))
        .curve(d3.curveMonotoneX);
      
      svg.append("path")
        .datum(subdata)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", colorScale(foodCategory))
        .style("stroke-width", "2");
      }); 
    });
  
    // legend
    for (let index in foods) {
      svg.append("circle").attr("cx",1080).attr("cy",19*(i+1)).attr("r", 6).style("fill", colorScale(foods[index])).attr("class", "legend");
      svg.append("text").attr("x", 1090).attr("y", 20*(i+1)).text(foods[index]).style("font-size", "15px").attr("alignment-baseline","middle")
      .style("fill", "gainsboro").style("font-family", "Helvetica").attr("class", "legend");
      i++;
    }

    // tooltip stuff
    let VertLine = svg.append('line')
    .attr("transform","translate(150,100)")
    .style("stroke", "white")
    .style("stroke-width", 2)
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", height - MARGIN.BOTTOM);

  // create a tooltip
  var tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);

  svg.on("mousemove", function() {
    var xPos = d3.pointer(event, this);
    var bandIndex = Math.floor(xPos[0] / xScale.step());


    VertLine.attr("x1", xScale(xScale.domain()[bandIndex])-MARGIN.LEFT)
      .attr("x2", xScale(xScale.domain()[bandIndex])-MARGIN.LEFT)
      let theYear = xScale.domain()[bandIndex];
      var yValues = filteredByFood.filter(function(d) { return d.mp_year == theYear && d.mp_month == 1; }).map(function(d) {
        return d.CityName;
      });
      // show tooltip
      tooltip.transition()
      .duration(200)
      .style("opacity", .9);
      var yValuesPrices = filteredByFood.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
        return d.mp_price;
      });

      var yValuesMonths = filteredByFood.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
        return d.mp_month;
      });;

      var yValuesFoods = filteredByFood.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
        return d.FoodName;
      });

      let text = "";
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
      for(let i = 0; i < yValues.length; i++)
      {
        text += "City: " + yValues[i] + "<br>";
        text += "Year: " + theYear + "<br>";
        text += "Food: " + yValuesFoods[i] + "<br>";
        text += "Price: " + formatter.format(yValuesPrices[i]) + "<br>";
        text += "<br>";
      }

        tooltip.html(text)
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
});
  }
}


///////////////////////////////////////////
//
//               SELECTIONS
//
///////////////////////////////////////////
// food dropdown
function foodSelect(sel) {
  // console.log(" food");

  d3.selectAll(".line").remove();
  d3.selectAll("circle").remove();
  d3.selectAll(".legend").remove();
  d3.selectAll(".tooltip").remove();

  foods = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    let opt = sel.options[i];
    if (opt.selected) {
      foods.push(opt.innerHTML);
    }
  }
  if (_lineGraph != undefined) {
    _lineGraph.drawChart();
  }
  else if (firstLoad) {
    setup();
    firstLoad = !firstLoad
  }
}

// country dropdown
function countrySelect(sel) {
  const country = document.getElementById("countryPicker").value;
			const cityDropdown = document.getElementById("marketPicker");
			cityDropdown.innerHTML = "<option value=''>--Select City--</option>";
			if (country) {
				const cities = citiesByCountry[country];
				cities.forEach(city => {
					const option = document.createElement("option");
					option.value = city;
					option.text = city;
          selectedCity = city;
					cityDropdown.appendChild(option);
				});
			}

    $('#marketPicker').selectpicker('refresh');

  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  
  // d3.selectAll(".tooltip").remove();
  var opt;
  countries = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      countries.push(opt.innerHTML);
    }
  }
  if (_lineGraph != undefined) {
    setup();
  }
  else if (firstLoad) {
    setup();
    firstLoad = !firstLoad;
  }
}

// city/market dropdown
function citySelect(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  
  // d3.selectAll(".tooltip").remove();

  var opt;
  cities = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      cities.push(opt.innerHTML);
    }
  }
  d3.select("#titleCity").html($("#marketPicker").val())
  d3.select("#range").html(filteredYears.length)
  if (_lineGraph != undefined) {
      setup();
  }
  else if (firstLoad) {
    setup();
    firstLoad = !firstLoad;
  }
}
