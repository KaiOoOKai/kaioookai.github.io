let d3 = window.d3;

let selectedCountry = "Philippines";
let selectedYear = 2003;
var opts = [];
var opts2 = [];
window.onload = function(){
    setup(food_prices_csv);
  
    // Get the query string from the URL
    var queryString = window.location.search;

    // Remove the '?' character from the beginning of the query string
    queryString = queryString.substring(1);

    // Split the query string into an array of parameter-value pairs
    var params = queryString.split('&');

    // Loop through the parameter-value pairs and extract the parameter value you need
    for (var i = 0; i < params.length; i++) {
      var param = params[i].split('=');
      console.log(param[1])
      if (param[0] === 'country') {
        selectedCountry = param[1];
      }
      else if (param[0] === 'year') {
        console.log(param[1]);
        selectedYear = param[1];
      }
    }
    $("select[name=yearSelect]").selectpicker('val', selectedYear);

    console.log(selectedCountry)
};

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":200,
};

const   width  = 2000,
        height = 800;

let setup = function (dataPath, opts, opts2) {

    //defining an easy reference for out SVG Container
    var SVG = d3.select("#SVG_CONTAINER");

    //Loading in our Data with D3
    let data = d3.csv(dataPath)
        .then(function (data) {
            //the data only exists within this scope
            let _stackedBar = new stackedBarChart(data,SVG);
        });
};

let stackedBarChart = function(data, svg){
  subset = data.filter(d=> { 
    // TO-DO: filter by selected year and country that was clicked on in the cartogram
    if(d.mp_year == selectedYear  & d.CountryName == selectedCountry){
      return d;
    }
  });

  // Compute max price for our axis
  const maxPrice = d3.max(subset, function(d){return +d3.sum([d['Apples (red) - Retail'], d['Beans - Retail'], d['Bread (wheat) - Retail'], d['Bread - Retail'], d['Cabbage - Retail'], d['Carrots - Retail'], d['Cucumbers - Retail'], d['Eggs - Retail'], d['Fish (frozen) - Retail'], d['Garlic - Retail'], d['Meat (beef) - Retail'], d['Meat (chicken) - Retail'], d['Meat (lamb) - Retail'], d['Meat (pork) - Retail'], d['Milk - Retail'], d['Oil (sunflower) - Retail'], d['Oil (vegetable) - Retail'], d['Onions - Retail'], d['Oranges - Retail'], d['Pasta - Retail'], d['Peas - Retail'], d['Potatoes - Retail'], d['Rice (high quality) - Retail'], d['Rice (low quality) - Retail'], d['Salt - Retail'], d['Sugar (local) - Retail'], d['Sugar (white) - Retail'], d['Tea (black) - Retail'], d['Tomatoes - Retail'], d['Walnuts - Retail'], d['Wheat - Retail'], d['Wheat flour (first grade) - Retail']])})

  // extract years
  // let years = d3.map(subset, function(d){return d.mp_year}).keys();

  let foods = data.columns.slice(3);
  let market = d3.map(subset, d => d.CityName);
  console.log(foods);

  let stackData = d3.stack()
      .keys(foods)(subset);

  let xScale = d3.scaleBand()
    .domain(market)
    .range([MARGIN.LEFT, width - MARGIN.RIGHT])
    .padding(0.1)

  let yScale = d3.scaleLinear()
    .domain([0, maxPrice])
    .range([height - MARGIN.BOTTOM, MARGIN.TOP])

  let color = d3.scaleOrdinal()
    .domain(['Apples (red) - Retail'], ['Beans - Retail'], ['Bread (wheat) - Retail'], ['Bread - Retail'], ['Cabbage - Retail'], ['Carrots - Retail'], ['Cucumbers - Retail'], ['Eggs - Retail'], ['Fish (frozen) - Retail'], ['Garlic - Retail'], ['Meat (beef) - Retail'], ['Meat (chicken) - Retail'], ['Meat (lamb) - Retail'], ['Meat (pork) - Retail'], ['Milk - Retail'], ['Oil (sunflower) - Retail'], ['Oil (vegetable) - Retail'], ['Onions - Retail'], ['Oranges - Retail'], ['Pasta - Retail'], ['Peas - Retail'], ['Potatoes - Retail'], ['Rice (high quality) - Retail'], ['Rice (low quality) - Retail'], ['Salt - Retail'], ['Sugar (local) - Retail'], ['Sugar (white) - Retail'], ['Tea (black) - Retail'], ['Tomatoes - Retail'], ['Walnuts - Retail'], ['Wheat - Retail'], ['Wheat flour (first grade) - Retail'])
    .range(d3.schemeCategory10);

  //TODO: group for chart (each group represent a race)
  let chart = svg.append('g')
    .attr('id','chart');

  let races_group = chart.selectAll('g')
    .data(stackData)
    .enter()
    .append('g')
    .attr('id', d => d.key)
    .attr('fill', d => color(d.key)); 

  // creates bars within the data
  let bars = races_group.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
      .attr('id', d => d.data.CityName)
      .attr('width', xScale.bandwidth)
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('x', d => xScale(d.data.CityName))
      .attr('y', d => yScale(d[1])); 

  var yAxis = d3.axisLeft()
    .scale(yScale);
      chart.append("g")
    .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
    .call(yAxis);

  var xAxis = d3.axisBottom()
    .tickFormat(d => d)
    .scale(xScale);
      chart.append("g")
    .attr("transform", "translate("+ 0 + ","+ (height-MARGIN.BOTTOM) +")")
    .attr("class", "xAxis")
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");
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
      console.log("clicked")
      opts.push(opt.innerHTML);
    }
  }
  // if(opts.length > 5){
  //   alert("Please select less than 5 food types");
  //   return
  // }
  //setup("global_food_prices.csv", opts);
  setup(food_prices_csv, opts, opts2);
}

function val2(sel) {
  d3.select("svg").remove();
  d3.select("#MAIN").append("svg");
  var opt;
  opts = [];
  var len = sel.options.length;
  for (var i = 0; i < len; i++) {
    opt = sel.options[i];

    if (opt.selected) {
      console.log("clicked")
      opts.push(opt.innerHTML);
    }
  }
  if(opts.length > 5){
    alert("Please select less than 5 food types");
    return
  }
  //setup("global_food_prices.csv", opts);
  setup(food_prices_csv, opts, opts2);
}
