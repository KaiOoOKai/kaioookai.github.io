const   width  = 1850,
        height = 875;

const MARGIN = {
    "LEFT":0,
    "RIGHT":0,
    "TOP":0,
    "BOTTOM":0,
};
let index = 0;

window.onload = function () {
    setup("../data/subset_data/num_markets.csv");
};

let zoom = d3.zoom()
	.scaleExtent([0.25, 10])
	.on('zoom', handleZoom);

function updateData() {
	data = [];
	for(let i=0; i<numPoints; i++) {
		data.push({
			id: i,
			x: Math.random() * width,
			y: Math.random() * height
		});
	}
}

function initZoom() {
	d3.select('svg')
		.call(zoom);
}

function handleZoom(e) {
	d3.select('svg g')
		.attr('transform', e.transform);
}

function zoomIn() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleBy, 2);
}

function zoomOut() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleBy, 0.5);
}

function resetZoom() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleTo, 1);
}

function center() {
	d3.select('svg')
		.transition()
		.call(zoom.translateTo, 0.5 * width, 0.5 * height);
}

function panLeft() {
	d3.select('svg')
		.transition()
		.call(zoom.translateBy, -50, 0);
}

function panRight() {
	d3.select('svg')
		.transition()
		.call(zoom.translateBy, 50, 0);
}

var svg = d3.select("#map");

svg.attr('width', width).attr('height', height)

const projection = d3.geoMercator()
                .scale(300)
                .translate([width /2, height / 2 + 80]); // center the map

const path = d3.geoPath(projection);

// Prepare a color palette
const colorScale = d3.scaleLinear()
    .domain([1, 205]) // FIXME - should be from 1 to the max num of markets in a 
    .range(["#3bcc00", "#cc0000"])

let setup = function (dataPath) {
    // parse the topojson file to produce the shape of each country
    const g = svg.append('g');

    return d3.json("../data/world.topojson").then(jsonData=> {
        return d3.csv('../data/subset_data/city_locations.csv').then(function (csvData) {
            const countries = topojson.feature(jsonData, jsonData.objects.countries);

            g.selectAll('path')
            .data(countries.features)
            .enter()
            .append("path")
            .attr("class", "country")
            .style("fill", (d, i) => {
                // console.log(val)
                // let val = csvData.find(e => e.CountryName == d.properties.name);

                // if (val != undefined) {
                //     if (d.properties.name == val.CountryName) {
                //         return colorScale(val.NumOfMarkets);
                //         // return "blue";
                //     }
                //     console.log(val.CountryName)
                // } else {
                //     return "#c8c8c8";
                // }
                return "#c8c8c8";
            })
            .attr("d", path)
            // TODO: when clicked, will link to the stack bargraph
            // .on("click", function(d){
            //     console.log(this);
            //     d3.select(this).classed("selected", true);
            // })
            // .append("a").attr("xlink:href", function(d, i) {
            //     console.log(d)
            //     return "https://www.google.com/search?q="+d.properties.name;}
            // )
            .on("mouseover", function(d){
                d3.select(this).classed("selected", true)
            })
            .on("mouseout", function(d){
                d3.select(this).classed("selected", false)
            })

          // add points for cities 
          g.selectAll("circle")
          .data(csvData)
          .enter()

          // FIXME: the dots should link to the stacked bar
          .append("a").attr("xlink:href", function(d) {
                         return "https://www.google.com/search?q="+d.CityName;}
                     )
          .append("circle")
          .attr("cx", function(d) {
                return projection([d.Longitude, d.Latitude])[0];
          })
          .attr("cy", function(d) {
                return projection([d.Longitude, d.Latitude])[1];
          })
          .attr("r", 2)
          .style("fill", "red")    // colour is based on average price for the market in that current year
          .attr("opacity", (d) => {
                return 0.5;
          })
        });


        // return d3.csv(dataPath).then(function (csvData) {
        //     const countries = topojson.feature(jsonData, jsonData.objects.countries);

        //     g.selectAll('path')
        //     .data(countries.features)
        //     .enter()
        //     .append("path")
        //     .attr("class", "country")
        //     .style("fill", (d, i) => {
        //         // console.log(val)
        //         let val = csvData.find(e => e.CountryName == d.properties.name);

        //         if (val != undefined) {
        //             if (d.properties.name == val.CountryName) {
        //                 return colorScale(val.NumOfMarkets);
        //                 // return "blue";
        //             }
        //             console.log(val.CountryName)
        //         } else {
        //             return "#c8c8c8";
        //         }
        //     })
        //     .attr("d", path)
        //     // TODO: when clicked, will link to the stack bargraph
        //     // .on("click", function(d){
        //     //     console.log(this);
        //     //     d3.select(this).classed("selected", true);
        //     // })
        //     .on("mouseover", function(d){
        //         d3.select(this).classed("selected", true)
        //     })
        //     .on("mouseout", function(d){
        //         d3.select(this).classed("selected", false)
        //     })        
    });

}




