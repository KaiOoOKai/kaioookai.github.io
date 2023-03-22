const   width  = 1344,
        height = 756;

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":200,
};
let index = 0;

window.onload = function () {
    setup("../sources/num_markets.csv");
};
const myPromise = new Promise((resolve, reject) => {
    let cms = "Hygraph";
  
    if (cms === "Sanity") {
      resolve("Success: The promise has successfully resolved!");
    } else {
      reject("Failure: The promise has failed!");
    }
  });
  
var svg = d3.select("#map");

// FIXME: center to web page
svg.attr('width',width).attr('height', height)
// .translate([MARGIN.LEFT, width - MARGIN.RIGHT])
// .translate([height-MARGIN.BOTTOM, MARGIN.TOP]);

const projection = d3.geoMercator()
                    .scale(200)
                    .translate([width /2, height / 2]); // center the map

const path = d3.geoPath(projection);

// Prepare a color palette
const colorScale = d3.scaleLinear()
    .domain([1, 205]) // FIXME - should be from 1 to the max num of markets in a 
    .range(["green", "red"])

let setup = function (dataPath) {
    // parse the topojson file to produce the shape of each country
    return d3.json("../sources/world.topojson").then(jsonData=> {
        return d3.csv(dataPath).then(function (csvData) {
            // return new Promise(function(resolve, reject) {

            // csvData.forEach(function(item, index, arr) {
            //     console.log(item.NumOfMarkets);
            // });

            const g = svg.append('g');
            const countries = topojson.feature(jsonData, jsonData.objects.countries);

            g.selectAll('path')
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", function(d) {
                // console.log(d.properties.name);     // TODO: colour the countries diff colours based on CSV?
                // d3.select(this).classed("country", "yellow")
                return "country"
            })
            // .style("fill", "yellow")
            .style("fill", (d, i) => {
                myPromise
                .then((message) => {
                    console.log(message);
                    var name2 = csvData[i].CountryName;
                    console.log( name2 == d.properties.name);
    
                    if (d.properties.name == name) {
                    // if (d.properties.name == "Afghanistan") {
                    // if (d.properties.name == "Djibouti") {
                        // console.log(csvData[i].CountryName)
                        console.log("ye")
                        return colorScale(csvData[i].NumOfMarkets);
                    }
                    else {
                        return "#cdcdcd";
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
            })
            .attr("d", path)
            // TODO: when clicked, will link to the stack bargraph
            // .on("click", function(d){
            //     console.log(this);
            //     d3.select(this).classed("selected", true);
            // })
            .on("mouseover", function(d){
                d3.select(this).classed("selected", true)
            })
            .on("mouseout", function(d){
                d3.select(this).classed("selected", false)
            });
        });
    // });
        
    });

}




