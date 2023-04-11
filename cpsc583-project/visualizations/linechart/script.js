let d3 = window.d3;
let max = 10;
let xScale;
let startYear = 2003;
let endYear = 2021;
let yearsArray = [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
var opts = [];
var opts2 = [];
var opts3 = [];

let filteredYears = yearsArray.filter(function(year) {
  return year >= startYear && year <= endYear;
});

let selectedCountry = "Afghanistan";
let selectedCity = "Hirat";

window.onload = function () {
  val(document.getElementById('foodPicker'));
  val2(document.getElementById('countryPicker'));

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
   $("select[name=countryPicker]").val([selectedCountry]);
   $("select[name=countryPicker]").selectpicker('refresh');
  
   const country = document.getElementById("countryPicker").value;
			const cityDropdown = document.getElementById("marketPicker");
			cityDropdown.innerHTML = "<option value=''>--Select City--</option>";
      var citiess = ['Daykundi', 'Gardez', 'Faryab', 'Khost', 'Hirat', 'Bamyan', 'Hilmand', 'Laghman', 'Nuristan', 'Nili', 'Mazar', 'Farah', 'Ghor', 'Nangarhar', 'Sar-e-Pul', 'Takhar', 'Baghlan', 'Kabul', 'Jawzjan', 'Kunar', 'Paktika', 'Kunduz', 'Zabul', 'Maidan Wardak', 'Balkh', 'Samangan', 'Nimroz', 'Jalalabad', 'Logar', 'Kapisa', 'Paktya', 'Panjsher', 'Maymana', 'Uruzgan', 'Badghis', 'Kandahar', 'Ghazni', 'Badakhshan', 'Parwan', 'Fayzabad'];
			if (country) {
				citiess.forEach(city => {
          
					const option = document.createElement("option");
					option.value = city;
					option.text = city;
          if(city == 'Hirat')
          {
            option.selected = true;
          }
					cityDropdown.appendChild(option);
				});
			}
  
  $('#marketPicker').selectpicker('refresh');

  opts2 = [];
  
  opts2.push(selectedCountry);
  val3(document.getElementById('marketPicker'));
 
};
var gggggg;
const MARGIN = {
  LEFT: 100,
  RIGHT: 100,
  TOP: 100,
  BOTTOM: 200,
};

const width = 1600,
  height = 800;

var _lineGraph; //define a global reference for scatter plot

setup = function (dataPath, food, country, market) {
  //defining an easy reference for out SVG Container
  var svg = d3.select("#MAIN svg");

  // Loading in our Data with D3
  d3.csv(dataPath).then(function (d) {
    //the data only exists within this scope
    var distinct = [];

    filteredYears = yearsArray.filter(function(year) {
      return year >= startYear && year <= endYear;
    });

    d = d.filter((i) => {
      return i.mp_month ==1;
    });

    d = d.filter((i) => {
      return i.mp_year <= endYear && i.mp_year >= startYear;
    });

    if (food != null && food.length != 0) {
      d = d.filter((i) => {
        return food.includes(i.FoodName);
      });
    }
    if (country != null && country.length != 0) {
      d = d.filter((i) => {
        return country.includes(i.CountryName);
      });
    }
    if (market != null && market.length != 0) {
      d = d.filter((i) => {
        return market.includes(i.CityName);
      });
    }
    if (food == undefined || country == undefined || market == undefined) d = [];
    else if (food.length == 0 || country.length == 0  || market.length == 0 ) d = [];
    
       var values = d.map(function(vvv) { return +vvv.mp_price; });
  
  // find the maximum value
  max = d3.max(values);
  max = 1.1 * max;
  
  gggggg = d;
    // create a barchart object
    _lineGraph = new lineGraph(d, svg, market);
    _lineGraph.draw();
  });
};

let lineGraph = function (data, svg, market) {
  // x scale will contain years
  xScale = d3
    .scaleBand()
    .domain(filteredYears) 
    .range([MARGIN.LEFT, width - MARGIN.RIGHT]);

  // y scale will contain price,
  let yScale = d3
    .scaleLinear()
    .domain([0, max]) // FIX ME
    .range([height - MARGIN.BOTTOM, MARGIN.TOP]);

  //draws our barchart
  this.draw = function () {
    let chart = svg.append("g").attr("class", "scatterPlot");

    var yAxis = d3.axisLeft().scale(yScale);

    // draw y-axis
    chart
      .append("g")
      .attr("transform", "translate(" + MARGIN.LEFT + "," + 0 + ")")
      .call(yAxis);

    var xAxis = d3
      .axisBottom()
      .scale(xScale)
      .tickValues([2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021])
      .ticks(5);

    // draw x-axis
    chart
      .append("g")
      .attr(
        "transform",
        "translate(" + 0 + "," + (height - MARGIN.BOTTOM) + ")"
      )
      .attr("class", "xAxis")
      .call(xAxis);

// Create SVG element for x-axis label
svg.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (width/2) + "," + (height + MARGIN.BOTTOM - 350) + ")")
    .text("Years");

// Create SVG element for y-axis label
svg.append("text")
    .attr("class", "y-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", MARGIN.LEFT-40)
    .attr("x", 50 - (height / 2))
    .attr("dy", "1em")
    .text("Price in CAD ($)");
    const scale = 10;

    let VertLine = svg.append('line')
    .attr("transform","translate(150,100)")
    .style("stroke", "black")
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
  var yValues = data.filter(function(d) { return d.mp_year == theYear && d.mp_month == 1; }).map(function(d) {
    return d.CityName;
  });
   // show tooltip
   tooltip.transition()
   .duration(200)
   .style("opacity", .9);
   var yValuesPrices = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
    return d.mp_price;
  });

  var yValuesMonths = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
    return d.mp_month;
  });;

  var yValuesFoods = data.filter(function(d) { return d.mp_year == theYear; }).map(function(d) {
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

    let circles = chart
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("stroke", "red")
      .attr("fill", "red")
      // x-axis encodes the sepal length
      // .attr("cx", (d) => xScale(d.mp_year)) // FIXME
      .attr("cx", function (d) {
        return xScale(d.mp_year) + xScale.bandwidth() / 2;
      })

      // y-axis encodes the sepal width
      .attr("cy", (d) => {
        return yScale(d.mp_price);
      }) // FIXME
      // radius of circle encode petal width
      .attr("r", 3)
      .style("opacity", function (d) {
        return 1;
      });
  };
  //var data = data[0];

  var foodCategories = ['Bread - Retail', 'Rice (low quality) - Retail', 'Rice (high quality) - Retail',
 'Meat (chicken) - Retail', 'Eggs - Retail', 'Milk - Retail', 'Meat (beef) - Retail',
 'Meat (pork) - Retail', 'Meat (lamb) - Retail','Fish (frozen) - Retail', 'Carrots - Retail', 
 'Onions - Retail', 'Potatoes - Retail', 'Beans - Retail', 'Salt - Retail',
 'Apples (red) - Retail', 'Tomatoes - Retail', 'Oranges - Retail', 'Wheat - Retail',
 'Bread (wheat) - Retail', 'Oil (vegetable) - Retail', 'Oil (sunflower) - Retail', 
 'Sugar (white) - Retail', 'Cabbage - Retail', 'Garlic - Retail', 'Sugar (local) - Retail', 
 'Pasta - Retail', 'Cucumbers - Retail', 'Wheat flour (first grade) - Retail', 
 'Walnuts - Retail', 'Peas - Retail', 'Tea (black) - Retail'];

  var subdata = [];

  foodCategories.forEach(function (foodCategory) {
    data = data.filter((i) => {
      return i.mp_year <= endYear && i.mp_year >= startYear;
    });
    subdata2 = data.filter((ss) => {
      return ss.FoodName == foodCategory;
    });
    market.forEach(element => {
      subdata = subdata2.filter((ss) => {
        return ss.CityName == element;
      });
      subdata.sort((a,b) => a.mp_year - b.mp_year);
      // Plot line
      var color = d3.rgb(Math.random() * 255, Math.random() * 255, Math.random() * 255);
      var line = d3
        .line()
        .x((d) => xScale(d.mp_year) + xScale.bandwidth() / 2)
        .y((d) => yScale(d.mp_price))
        .curve(d3.curveMonotoneX);
      svg
        .append("path")
        .datum(subdata)
        .attr("class", "line")
        .attr("d", line)
        .style("fill", "none")
        .style("stroke", color.toString())
        .style("stroke-width", "2");

    });
  });
};


function val(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts.push(opt.innerHTML);
    }
  }

  setup(global_prices_csv, opts, opts2, opts3);
}

function val2(sel) {
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
  var opt;
  opts2 = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts2.push(opt.innerHTML);
    }
  }

  //setup("global_food_prices.csv", opts);
  setup(global_prices_csv, opts, opts2, opts3);
}

function val3(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts3 = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      opts3.push(opt.innerHTML);
    }
  }
  setup(global_prices_csv, opts, opts2, opts3);
}
