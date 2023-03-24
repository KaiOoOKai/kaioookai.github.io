const   width  = 1850,
        height = 875;

const MARGIN = {
    "LEFT":0,
    "RIGHT":0,
    "TOP":0,
    "BOTTOM":0,
};
let index = 0;

const avg_mrkt_csv = "../data/subset_data/num_markets.csv";
const all_mrkt_csv = "../data/subset_data/city_locations.csv";

var svg = d3.select("#map");

svg.attr('width', width).attr('height', height)

// svg.append("")

// see if button was pressed to change display
// d3.select("#avg_mrkt_btn").on("click", function() {
//     d3.select("#avg_mrkt_btn")
//         .style("display", "none");

//     d3.select("#all_mrkt_btn")
//         .style("display", "fill");
//     console.log("clicked avg");
// });

// NOT WORKING!!!
d3.select("#all_mrkt_btn").on("click", function() {
    // console.log("clicked");
    console.log("clicked all");
    d3.select("#avg_mrkt_btn")
        .attr("background", "blue")
        // .style("display", "fill");
    // d3.select("#all_mrkt_btn")
    //     .style("display", "none");
});


window.onload = function () {
    console.log(avg_markets);
    setup("../data/subset_data/num_markets.csv");

    // if (displayMarkets) {
    //     console.log("displaying num markets");
    //     setup("../data/subset_data/num_markets.csv");
    // } else {
    //     console.log("displaying all markets");
    //     setup("../data/subset_data/city_locations.csv");
    // }
};


const projection = d3.geoMercator()
                .scale(300)
                .translate([width /2, height / 2 + 80]); // center the map

const path = d3.geoPath(projection);

// Prepare a color palette
const colorScale = d3.scaleLinear()
    .domain([1, 205]) // FIXME - should be from 1 to the max num of markets in a 
    .range(["#3bcc00", "#cc0000"])

const g = svg.append('g');

function displayAllMarkets() {
    return d3.csv(all_mrkt_csv).then(function (csvData) {
        console.log("displaying all markets");
        // change back to original colour 
        g.selectAll('path')
            .attr("fill", "#c8c8c8")

        // add points for cities 
        g.selectAll("circle")
            .data(csvData)
            .enter()

        // FIXME: the dots should link to the stacked bar
    //   .append("a").attr("xlink:href", function(d) {
    //                  return "https://www.google.com/search?q="+d.CityName;}
    //              )
            .append("circle")
            .attr("opacity", 0.5)
            .attr("cx", function(d) {
                return projection([d.Longitude, d.Latitude])[0];
            })
            .attr("cy", function(d) {
                return projection([d.Longitude, d.Latitude])[1];
            })
            .attr("r", 2)
            .attr("fill", "red")    // FIXME colour is based on average price for the market in that current year
            // .on('mouseover', function(event, d, i) {
            //     d3.select(this).attr('fill', 'white');
            //     // TO DO DISPLAY market details (avg price, name )
            //     // Display rect on the x and y your cursor is on 
            //     // svg.append('rect')
            // })
            // .on('mouseleave', function(event, d, i) {
            //     d3.select(this).attr('fill', 'red');
            // })
    });
        
}

function displayAverageMarkets() {

    return d3.csv(avg_mrkt_csv).then(function (csvData) {
        console.log("displaying average markets");

        // fill the colour of the country to represent the number of markets in that country 
        g.selectAll('path')
            .attr("fill", (d, i) => {
                let val = csvData.find(e => e.CountryName == d.properties.name);
                if (val != undefined) {
                    if (d.properties.name == val.CountryName) {
                        return colorScale(val.NumOfMarkets);
                    }
                } else {
                    return "#c8c8c8";
                }
            })
            .attr("d", path);
            // TODO: when country clicked, will link to the stack bargraph
            // .on("click", function(d){
            //     console.log(this);
            //     d3.select(this).classed("selected", true);
            // })
            // .on("mouseover", function(d){
            //     d3.select(this).classed("selected", true)
            // })
            // .on("mouseout", function(d){
            //     d3.select(this).classed("selected", false)
            // }) 

        // PROBLEMS!!! COLOUR DOESN'T GO BACK 
        // make circles (that represent market/cities) disappear 
        g.selectAll("circle")
            .attr("opacity", 0)
  
    });
}

/******************************
 *
 *    Parent Call function
 *
 *****************************/
let setup = function (dataPath) {
    // parse the topojson file to produce the shape of each country
    return d3.json("../data/world.topojson").then(jsonData=> {
        if (avg_markets) {
            console.log("displaying num markets");
            displayAverageMarkets(avg_mrkt_csv);
        } else {
            console.log("displaying all markets");
            displayAverageMarkets(all_mrkt_csv);
        }

        const countries = topojson.feature(jsonData, jsonData.objects.countries);

        g.selectAll('path')
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("fill", "#c8c8c8")
            .attr("d", path);     
    });

}




