const   width  = 1344,
        height = 756;

const MARGIN = {
    "LEFT":100,
    "RIGHT":100,
    "TOP":100,
    "BOTTOM":200,
};

window.onload = function () {
    setup("global_food_prices.csv");
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


setup = function (dataPath) {
    // parse the topojson file to produce the shape of each country
    d3.json("world.topojson").then(data=> {
        d3.csv(dataPath).then(function (csvData) {
            const g = svg.append('g');
            const countries = topojson.feature(data, data.objects.countries);

            g.selectAll('path')
            .data(countries.features).enter()
            .append("path")
            .attr("class", function(d) {
                // console.log(d.properties.name);     // TODO: colour the countries diff colours based on CSV?
                return "country"
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




