let d3 = window.d3;
let max = 2;
let xScale;

var foodCategories = ['Bread', 'Rice (low quality)', 'Rice (high quality)',
'Chicken', 'Eggs', 'Milk', 'Beef',
'Pork', 'Lamb','Fish', 'Carrots', 
'Onions', 'Potatoes', 'Beans', 'Salt',
'Red Apples', 'Tomatoes', 'Oranges', 'Wheat',
'Bread (wheat)', 'Oil (vegetable)', 'Oil (sunflower)', 
'Sugar (white)', 'Cabbage', 'Garlic', 'Sugar (local)', 
'Pasta', 'Cucumbers', 'Flour (first grade)', 
'Walnuts', 'Peas', 'Tea (black)'];

let yearsArray = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
let startYear = yearsArray[0];
let endYear = 2021;

var foods = [];
var countries = [];
var cities = [];

let loaded = 0;

let firstLoad = true;

// filtered years
let filteredYears = yearsArray.filter(function(year) {
  return year >= startYear && year <= endYear;
});

// defaulted selected country and city
let selectedCountry = "Afghanistan";
let selectedCity = "Hirat";

let colorScale = d3.scaleOrdinal()
.domain(['Red Apples','Beans','Bread (wheat)','Bread','Cabbage','Carrots','Cucumbers','Eggs','Fish','Garlic','Beef','Chicken','Lamb','Pork','Milk','Oil (sunflower)','Oil (vegetable)','Onions','Oranges','Pasta','Peas','Potatoes','Rice (high quality)','Rice (low quality)','Salt','Sugar (local)','Sugar (white)','Tea (black)','Tomatoes','Walnuts','Wheat','Flour (first grade)'])
.range(['#FF5733', '#C70039', '#900C3F', '#581845', '#4A235A', '#7D3C98', '#00FF7F', '#00FA9A', '#00CED1', '#1E90FF', '#4169E1', '#0000FF', '#8B008B', '#800080', '#FF1493', '#FF00FF', '#FF4500', '#FFD700', '#FFA500', '#FF8C00', '#008000', '#228B22', '#6B8E23', '#FFC0CB', '#FFB6C1', '#FF69B4', '#DC143C', '#B22222', '#FF6347', '#FF7F50', '#F08080', '#E9967A']);

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

  
  // year select 
  var slider = document.getElementById('slider');
  var label = document.getElementById('year-label');

  noUiSlider.create(slider, {
    start: [2003, 2021],
    range: {
      'min': 2003,
      'max': 2021
    },
    step: 1, // Set the step interval to 1
    connect: true
  });


  slider.noUiSlider.on('update', function(values, handle) {
    startYear = parseInt(values[0]);
    endYear = parseInt(values[1]);
    var selectedYears = startYear + ' - ' + endYear;
    label.innerHTML = 'Selected Years: ' + selectedYears;
    d3.select("svg").remove();
    d3.select("#MAIN").append("svg");
    d3.selectAll(".tooltip").remove();
    d3.select("#range").html(endYear - startYear + 1)
    setup();
  });

};

function setup(){
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
    .range([100,1500]);

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
      .tickValues(filteredYears);

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
      if (foods.includes(i.FoodName)) { return foods; }
    });
  
    // draw points
    let circles = chart.selectAll("circle")
    .data(filteredByFood)
    .enter()
    .append("circle")
    .attr("fill", (d)=>colorScale(d.FoodName))
    .attr("cx", function (d) { return xScale(d.mp_year) + xScale.bandwidth() / 2; })
    .attr("cy", (d) => {return yScale(d.mp_price);})
    .attr("r", 5)
    .style("opacity", 0.5);

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
      svg.append("circle").attr("cx",100).attr("cy",14*(i+1)).attr("r", 6).style("fill", colorScale(foods[index])).attr("class", "legend");
      svg.append("text").attr("x", 110).attr("y", 15*(i+1)).text(foods[index]).style("font-size", "15px").attr("alignment-baseline","middle")
      .style("fill", "gainsboro").style("font-family", "Helvetica").attr("class", "legend");
      i++;
    }

    // tooltip stuff
    let VertLine = null;

    // create a tooltip
    var tooltip = null;
    let tooltipCreated = false;

    svg.on("mouseout", function() {
      VertLine.style("opacity", 0);
      tooltip.style("opacity", 0);
    });

    

    
    let moveCount = 0;
    const handleMouseMove = (event) => {
      if (moveCount > 3) {
    
          if (!tooltipCreated) {
            // create the tooltip
            tooltipCreated = true;
          }
      
          var xPos = d3.pointer(event, this);
          var bandIndex = Math.floor((event.pageX -150)/ xScale.step());
      
        
      
          if (!VertLine) {
            VertLine = svg.append('line')
          .attr("transform","translate(150,100)")
          .style("stroke", "white")
          .style("stroke-width", 2)
          .style("opacity", 0)
          //.attr("x1", (xScale(xScale.domain()[bandIndex])+700/filteredYears.length))
          .attr("y1", 0)
          //.attr("x2", (xScale(xScale.domain()[bandIndex])+700/filteredYears.length))
          .attr("y2", height - MARGIN.BOTTOM);
          }
          if(!isNaN(xScale(xScale.domain()[bandIndex])+700/filteredYears.length))
          {
            VertLine.attr("x1",bandIndex*xScale.step()+500/(filteredYears.length-1)-40)
            .attr("x2", bandIndex*xScale.step()+500/(filteredYears.length-1)-40)
            .style("opacity", 1);
          }
 
      console.log(bandIndex)
            
            let theYear = xScale.domain()[bandIndex];
            var yValues = filteredByFood.filter(function(d) { return d.mp_year == theYear && d.mp_month == 1; }).map(function(d) {
              return d.CityName;
            });
      
      if(!tooltip)
      {
        tooltip= d3.select("body")
          .append("div")
          .attr("class", "tooltip")
          .style("opacity", 0);
      }
          
      
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
            if(text == "")
            {
                // show tooltip
        d3.select(".tooltip").transition()
        .style("opacity", 0);
              tooltip.html(text)
                .style("left", (event.pageX + 10) + "px")
                .style("top", (event.pageY - 28) + "px");
            }
            else
            {
      
            // show tooltip
            d3.select(".tooltip").transition()
            .duration(200)
            .style("opacity", .9);
                  tooltip.html(text)
                    .style("left", (event.pageX + 10) + "px")
                    .style("top", (event.pageY - 28) + "px");
                }
      
      
      } else {
        moveCount++;
      }
    };
    
    
      svg.on("mousemove", handleMouseMove);
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
    console.log("first")
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
  d3.selectAll(".tooltip").remove();

  var opt;
  countries = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      countries.push(opt.innerHTML);
    }
  }
  setup();
}

// city/market dropdown
function citySelect(sel) {
  d3.selectAll(".tooltip").remove();
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");

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
  
  setup();

}
