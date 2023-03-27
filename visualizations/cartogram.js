let avg_markets = true;

const   width  = 1850,
        height = 875;

const MARGIN = {
    "LEFT":0,
    "RIGHT":10,
    "TOP":10,
    "BOTTOM":0,
};

const BOX_SIZE = 30;

let index = 0;

const avg_mrkt_csv = "../data/subset_data/num_markets.csv";
const all_mrkt_csv = "../data/subset_data/city_locations.csv";
const global_prices_csv = "../data/global_food_prices.csv";

var svg = d3.select("#map");
svg.attr('width', width).attr('height', height)

let selectedYear = 2004;

window.onload = function () {
    setupCartogram();
    drawLegend();

    // checks for when we click the  "Display All Markets" button
    d3.select("#all_mrkt_btn").on("click", function() {
        d3.select("#avg_mrkt_btn").style("display", "block");   // make "Display Average Markets" button appear              
        d3.select("#all_mrkt_btn").style("display", "none");    // make "Display All Markets" button disappear
        d3.select("#selectYear").style("display", "block");     // make "Year Selection" appear              
        avg_markets = false;
    });

    // checks for when we click the "Display Average Markets" button
    d3.select("#avg_mrkt_btn").on("click", function() {
        d3.select("#avg_mrkt_btn").style("display", "none");    // make "Display Average Markets" button disappear   
        d3.select("#all_mrkt_btn").style("display", "block");   // make "Display All Markets" button appear
        d3.select("#selectYear").style("display", "none");      // make "Year Selection" appear      
        avg_markets = true;
    });

    let years = [2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 
                2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
        
    // add the years to the button
    d3.select("#selection")
      .selectAll('myOptions')
     	.data(years)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button
};

const projection = d3.geoMercator()
                .scale(300)
                .translate([width /2, height / 2 + 80]); // center the map

const path = d3.geoPath(projection);

// Prepare a color palette for heat map
const colorScale = d3.scaleLinear()
    .domain([1, 205])                   // FIXME - should be from 1 to the max num of markets in a 
    .range(["#3bcc00", "#cc0000"])

const g = svg.append('g');

function drawLegend() {
        // legend
    // POSSIBLY MOVE THIS INTO ITS OWN FUNCTION
    svg.append("rect")
        .attr("x", 20).attr("y",height-250)
        .style("fill", "white")
        .attr("width", 400).attr("height", 200)
        .attr("stroke", "black");

    // write the label "Legend"
    svg.append("text").attr("x", 40).attr("y", height-230)
        .text("Legend").style("font-family", "Arial")
        .style("font-size", "20px")
        .attr("alignment-baseline","middle")
    
    // Colour scale, dynamically create 10 squares to represent a gradient legend
    // TO-DO: add number of markets on legend, from 1-205 markets
    // -> 1-20, 21-40, 41-60, 61-80, 81-100, 101-130, 131-150, 151-170, 171-190, 191-205
    for (let i=0; i < 11; i++) {
        svg.append("rect").attr("x", 60+BOX_SIZE*i).attr("y", height-220)
            .style("fill", function(d){
                return colorScale(20*`${i}`);
            })
            .attr("height", BOX_SIZE).attr("width", BOX_SIZE)
    }
}

var toolTip = function() {
    return svg.append("rect")
            .attr("class", "tool-tip")
            .attr("height", 100)
            .attr("width", 200)
            .style("fill", "white")
            .attr("stroke", "black");
}

// When the button is changed, update the data
d3.select("#selection").on("change", function(d) {
    // recover the option that has been chosen
    selectedYear = d3.select(this).property("value");
    console.log(selectedYear)
    // TODO: update based on selected year
    // run the updateChart function with this selected option
    // update(selectedOption)
})


function displayAllMarkets() {
    let gp_subdata;

    return d3.csv(all_mrkt_csv).then(function (all_mrkt_data) {
        // d3.csv(global_prices_csv).then(function (gp_data){
            gp_subdata = gp_data.filter(gd =>  {
                return gd.mp_year == selectedYear
            });
            
    
            console.log("displaying all markets");
            // change back to original colour 
            g.selectAll('path')
                .attr("fill", "#c8c8c8")

            console.log(subdata);
            // add points for cities 
            g.selectAll("circle")
                .data(subdata)              // ERROR
                // .data(all_mrkt_data)
                .enter()
                .append("circle");

            g.selectAll("circle")
                .attr("opacity", 0.5)
                .attr("cx", function(d) {
                    return projection([d.Longitude, d.Latitude])[0];
                })
                .attr("cy", function(d) {
                    return projection([d.Longitude, d.Latitude])[1];
                })
                .attr("r", 2)
                // .attr("fill", "red")    // FIXME colour is based on average price for the market in that current year
                .attr("fill", function(d) {
                    console.log(d);
                })            
                // FIXME: only darken circles when in the display all markets view
                .on('mouseover', function(event, d, i) {
                    // d3.select(this).attr('opacity', 1);
                    console.log(d.CityName);
                    toolTip()
                    .attr("x", (event.pageX - 220))
                    .attr("y", (event.pageY - 140))
                    .style("opacity", 1)
                    
                    // Market text
                    svg.append("text")
                    .text(d.CityName + " market")
                    .attr("class", "tip-text-1")
                    .attr("x", event.pageX + MARGIN.RIGHT - 220).attr("y", event.pageY - 120)
                    .style("font-family", "Arial").style("font-weight", 900);
                    
                    // Country of origin (?) i dont have in CSV :(
                    svg.append("text")
                    .attr("class", "tip-text-2")
                    .text("• Country: " + d.CountryName)
                    .attr("x", event.pageX + MARGIN.RIGHT - 215).attr("y", event.pageY - 90)
                    .style("font-family", "Arial");

                    // TODO: Average price text
                    svg.append("text")
                    .attr("class", "tip-text-3")
                    .text("• Average Price: $" + "")
                    .attr("x", event.pageX + MARGIN.RIGHT - 215).attr("y", event.pageY - 70)
                    .style("font-family", "Arial");
        
                    // TO DO DISPLAY market details (avg price, name )

                })
                .on('mouseleave', function(event, d, i) {
                    // remove content
                    d3.selectAll(".tool-tip").remove();
                    d3.selectAll(".tip-text-1").remove();
                    d3.selectAll(".tip-text-2").remove();
                    d3.selectAll(".tip-text-3").remove();
                
                    // d3.select(this).attr('opacity', '0.5');
                });
                //            // FIXME: the dots should link to the stacked bar
                //            .append("a").attr("xlink:href", function(d) {
                //             return "https://www.google.com/search?q="+d.CityName;}
                //         )
            
            });
    // });
}

function displayAverageMarkets() {
    return d3.csv(avg_mrkt_csv).then(function (avg_mrkt_data) {
        console.log("displaying average markets");

        // fill the colour of the country to represent the number of markets in that country 
        g.selectAll('path')
        // .append("a").attr("xlink:href", function(d) {
        //     console.log(d.properties.name);
        //     return "https://www.google.com/search?q="+d.properties.name;}
        // )
            .attr("fill", (d, i) => {
                let val = avg_mrkt_data.find(e => e.CountryName == d.properties.name);
                if (val != undefined) {
                    if (d.properties.name == val.CountryName) {
                        return colorScale(val.NumOfMarkets);
                    }
                } else {
                    return "#c8c8c8";
                }
            })
            .attr("opacity", 0.9)

        //     .append("a").attr("xlink:href", function(d) {
        //         return "https://www.google.com/search?q="+d.CityName;}
        // )
            // TODO: when country clicked, will link to the stack bargraph
            .on("click", function(d){
                // d.properties.name 
                console.log(clicked);
                d3.select(this).classed("selected", true);
            })
        
        // FIXME: only hover when the averages are displayed
        if (avg_markets) {
            console.log(avg_markets);

            g.selectAll('path').on("mouseover", function(d){
                d3.select(this).attr("opacity", 1);
            })
            g.selectAll('path').on("mouseout", function(d){
                d3.select(this).attr("opacity", 0.9);
            }) 
        }
        // make circles (that represent market/cities) disappear 
        g.selectAll("circle").attr("opacity", 0);
    });
}

/******************************
 *
 *    Parent Call function
 *
 *****************************/
let setupCartogram = function () {
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




