let d3 = window.d3;

let foods_opts = [];
let year_opts = [];

let selectedCountry = "Philippines";
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

        $('#titleCountry').text(selectedCountry);
      }
    }
    console.log(selectedCountry)
    d3.select("#titleCountry").html(selectedCountry)
};

function gotoLineChart(){
  window.open("../linechart/index.html?country=" + selectedCountry, '_blank', 'width=1520,height=900,left=800,top=100');
}

const MARGIN = { "LEFT":100, "RIGHT":100, "TOP":100, "BOTTOM":200 };

let   width  = 850,
      height = 800;

let setup = function (dataPath) {
  
  d3.select("#SVG_CONTAINER").attr("width", )

  d3.csv(dataPath)
    .then(function (data) {
        // display only first 5 foods for stacked bar
        foods = data.columns.slice(1, 6);
        stackedBarChart(data);
    });
};

let stackedBarChart = function(data){
  subset = data.filter(d=> { 
    // filter by selected year and country that was clicked on in the cartogram
    if(d.CountryName == selectedCountry){ return d; }
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
  if (market.length > 20) {
    width = (market.length * 40) - MARGIN.LEFT;
  }

  let svg = d3.select("#SVG_CONTAINER").attr("width", width).attr("height", 800);

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
  .domain(['Red Apples','Beans','Bread (wheat)','Bread','Cabbage','Carrots','Cucumbers','Eggs','Fish','Garlic','Beef','Chicken','Lamb','Pork','Milk','Oil (sunflower)','Oil (vegetable)','Onions','Oranges','Pasta','Peas','Potatoes','Rice (high quality)','Rice (low quality)','Salt','Sugar (local)','Sugar (white)','Tea (black)','Tomatoes','Walnuts','Wheat','Flour (first grade)'])
  .range(['#FF5733', '#C70039', '#900C3F', '#581845', '#4A235A', '#7D3C98', '#00FF7F', '#00FA9A', '#00CED1', '#1E90FF', '#4169E1', '#0000FF', '#8B008B', '#800080', '#FF1493', '#FF00FF', '#FF4500', '#FFD700', '#FFA500', '#FF8C00', '#008000', '#228B22', '#6B8E23', '#FFC0CB', '#FFB6C1', '#FF69B4', '#DC143C', '#B22222', '#FF6347', '#FF7F50', '#F08080', '#E9967A']);
  

    // Prep the tooltip bits, initial display is hidden
    var tooltip = d3.select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("opacity", 0.9);
  
    tooltip.append("rect")
    .attr("width", 80)
    .attr("height", 60)
    .attr("fill", "white")
    .style("opacity", 0.5);

    tooltip.append("text")
    .attr("x", 15)
    .attr("dy", "1.2em")
    .style("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold");

  let chart = svg.append('g')
    .attr('id','chart');

    var mouseover = function(d) {
      var xPos = d3.pointer(event, this);
      var bandIndex = Math.floor((xPos[0] - MARGIN.LEFT) / xScale.step());
      
      var xPosition = xPos[0] - 15;
      var yPosition = xPos[1] - 25;
      const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      });
        // Show the tooltip
    d3.select("#tooltip")
    .style("visibility", "visible")
    .html("Category: " + d.currentTarget.__data__.key + "<br>"+
    "Market: " + d.currentTarget.__data__[bandIndex].data.CityName + "<br>"
              + "Value: " + formatter.format(d.currentTarget.__data__[bandIndex].data[d.currentTarget.__data__.key]));

     // Position the tooltip
     d3.select("#tooltip")
     .style("left", (xPosition + 10) + "px")
     .style("top", (yPosition + 10) + "px");
    }

  let food_group= chart.selectAll('g')
    .data(stackData)
    .enter()
    .append('g')
    .attr('id', d => d.key)
    .attr('fill', d => color(d.key))
    .on("mouseover", mouseover);

  // creates bars within the data
  let bars = food_group.selectAll('rect')
    .data(d => d)
    .enter()
    .append('rect')
      .attr('id', d => d.data.CityName)
      .on("click", function(d) {
        handleClick(d);
      })
      .attr('width', xScale.bandwidth)
      .attr('height', d => yScale(d[0]) - yScale(d[1]))
      .attr('x', d => xScale(d.data.CityName))
      .transition()
      .duration(1000)
      .attr('y', d => yScale(d[1])); 

      function handleClick(id) {
        window.location.href = "../linechart/index.html?country=" +selectedCountry+"&city="+ id.currentTarget.__data__.data.CityName;
       ;
    }

  food_group.selectAll('rect')
  .on("mouseover", function(d){
    d3.select(this).attr("opacity", 0.8);
  })
  .on("mouseout", function(d){
    d3.select(this).attr("opacity", 1);
  })

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



// Create SVG element for x-axis label
svg.append("text")
    .attr("class", "x-axis-label")
    .attr("text-anchor", "middle")
    .attr("transform", "translate(" + (width/2) + "," + (height + MARGIN.BOTTOM - 300) + ")")
    .attr("font-size", "15px")
    .text("Market Names");

// Create SVG element for y-axis label
svg.append("text")
    .attr("class", "y-axis-label")
    .style("fill", "gainsboro")
    .style("font-family", "Helvetica")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("y", MARGIN.LEFT-40)
    .attr("x", 50 - (height / 2))
    .attr("dy", "1em")
    .attr("font-size", "15px")
    .text("Price in CAD ($)");
    
// Handmade legend
if(foods_opts.length!=0){
    for(let i = 0; i < foods_opts.length; i++)
    { 
      let legendColor = color(foods_opts[i])
      svg.append("circle").attr("cx",100).attr("cy",15*(i+1)).attr("r", 6).style("fill", legendColor)
      svg.append("text").attr("x", 110).attr("y", 16*(i+1)).text(foods_opts[i]).style("font-size", "15px").style("font-family", "Helvetica").style("fill", "gainsboro").attr("alignment-baseline","middle")
    }
  }
  else{
    for(let i = 0; i < foods.length; i++)
    { 
      let legendColor = color(foods[i])
      svg.append("circle").attr("cx",100).attr("cy",15*(i+1)).attr("r", 6).style("fill", legendColor)
      svg.append("text").attr("x", 110).attr("y", 16*(i+1)).text(foods[i]).style("font-size", "15px").style("font-family", "Helvetica").style("fill", "gainsboro").attr("alignment-baseline","middle")
    }
  }

};

function foodchange(sel) {
  let newfoods;

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
