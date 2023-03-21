const   width  = 1344,
        height = 756;

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":200,
};

window.onload = function () {
    setup("../sources/num_markets.csv");
};

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
    d3.json("../sources/world.topojson").then(jsonData=> {
        // new Promise(function(resolve, reject) {

        //     jsonData.features.forEach(function(d) {
        //         console.log(d.properties.name);
        //     })
        // });

        d3.csv(dataPath).then(function (csvData) {
            console.log(csvData[0].CountryName)
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
            .style("fill", d=> {

                // console.log(csvData)
                return colorScale(1)
            })
            .attr("d", path)
            // TODO: when clicked, will link to the stack bargraph
            // .on("click", function(d){
            //     console.log(d);
            //     d3.select(this).classed("selected", true);
            // })
            .on("mouseover", function(d){
                d3.select(this).classed("selected", true)
            })
            .on("mouseout", function(d){
                d3.select(this).classed("selected", false)
            });
        });
    });
}




