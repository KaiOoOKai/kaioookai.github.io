let d3 = window.d3;



let foods_opts = [];
let year_opts = [];

let selectedCountry = "Philippines";
let selectedYear = 2021;

let foods; 

window.onload = function(){

    setup(food_prices_csv);
  
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
      else if (param[0] === 'year') {
        selectedYear = param[1];
      }
    }
    $("select[name=yearSelect]").selectpicker('val', selectedYear);
  
    // not working
    $("select[name=foodPicker]").selectpicker('val2', "Apples (red) - Retail");
    $("select[name=foodPicker]").selectpicker('val2', "Beans - Retail");
    $("select[name=foodPicker]").selectpicker('val2', "Bread (wheat) - Retail");
    $("select[name=foodPicker]").selectpicker('val2', "Bread - Retail");
    $("select[name=foodPicker]").selectpicker('val2', "Cabbage - Retail");
};

const MARGIN = { "LEFT":100, "RIGHT":100, "TOP":100, "BOTTOM":200 };

const   width  = 2000,
        height = 800;

let setup = function (dataPath) {
  d3.csv(dataPath)
    .then(function (data) {
        // display only first 5 foods for stacked bar
        // - display, this range should be passed in (?)
        foods = data.columns.slice(3, 8);
        stackedBarChart(data);
    });
};

let stackedBarChart = function(data){
  console.log(selectedYear);
  console.log(foods);
  let svg = d3.select("#SVG_CONTAINER");
  subset = data.filter(d=> { 
    // filter by selected year and country that was clicked on in the cartogram
    if(d.mp_year == selectedYear  & d.CountryName == selectedCountry){ return d; }
  });

  // Compute max price for given columns
  const maxPrice = d3.max(subset, function(d){
    let sum = 0;
    if (foods != undefined){
      for (let index=0; index < foods.length; index++) {
        sum = sum + parseFloat(d[foods[index]]);
      }
      return sum;
    }
  })

  let market = d3.map(subset, d => d.CityName);
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

  let chart = svg.append('g')
    .attr('id','chart');

  let food_group= chart.selectAll('g')
    .data(stackData)
    .enter()
    .append('g')
    .attr('id', d => d.key)
    .attr('fill', d => color(d.key)); 

  // creates bars within the data
  let bars = food_group.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
      .attr('id', d => d.data.CityName)
      .attr('width', xScale.bandwidth)
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('x', d => xScale(d.data.CityName))
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d[1])); 

  let yAxis = d3.axisLeft()
    .scale(yScale);
      chart.append("g")
    .attr("transform", "translate("+ MARGIN.LEFT + ","+ 0 +")")
    .call(yAxis);

  let xAxis = d3.axisBottom()
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

    
// Handmade legend
if(foods_opts.length!=0){
    for(let i = 0; i < foods_opts.length; i++)
    { 
      let legendColor = color(foods_opts[i])
      svg.append("circle").attr("cx",200+150*i).attr("cy",height-120).attr("r", 6).style("fill", legendColor)
      svg.append("text").attr("x", 220+150*i).attr("y", height-120).text(foods_opts[i]).style("font-size", "15px").attr("alignment-baseline","middle")
    }
  }
  else{
    for(let i = 0; i < foods.length; i++)
    { 
      let legendColor = color(foods[i])
      svg.append("circle").attr("cx",200+220*i).attr("cy",height-120).attr("r", 6).style("fill", legendColor)
      svg.append("text").attr("x", 220+220*i).attr("y", height-120).text(foods[i]).style("font-size", "15px").attr("alignment-baseline","middle")
    }
  }

};

let newfoods;
function foodchange(sel) {
  // delete old svgs
  d3.select("svg").remove();

  // add new one for the stackedBarChart to append to
  d3.select("#MAIN").append("svg").attr("id", "SVG_CONTAINER");

  foods_opts = [];
  let len = sel.options.length;

  for (let i = 0; i < len; i++) {
    let opt = sel.options[i];
    if (opt.selected) {
      foods_opts.push(opt.innerHTML);
    }
  }

  // create new data
  d3.csv(food_prices_csv).then(function (data) {
    if(foods_opts.length!= 0) {
      newfoods = data.columns.slice(3).filter(i => {
        if (foods_opts.includes(i)) { return foods_opts; }
      })
    }
    foods = newfoods;
    stackedBarChart(data)
  });
}

function yearchange(sel) {
  d3.select("svg").remove();  // delete old svgs
  d3.select("#MAIN").append("svg").attr("id", "SVG_CONTAINER"); // add new one for the stackedBarChart to append to

  let opt;
  year_opts = [];
  let len = sel.options.length;
  for (let i = 0; i < len; i++) {
    opt = sel.options[i];
    if (opt.selected) {
      selectedYear = opt.value;
      year_opts.push(opt.innerHTML);
    }
  }

  // call stackedBarChart again
  d3.csv(food_prices_csv).then(function (data) {
    stackedBarChart(data)
  });
}
