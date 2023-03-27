
let zoom = d3.zoom()
	.scaleExtent([1, 5])
	.on('zoom', handleZoom);

// function updateData() {
// 	data = [];
// 	for(let i=0; i<numPoints; i++) {
// 		data.push({
// 			id: i,
// 			x: Math.random() * width,
// 			y: Math.random() * height
// 		});
// 	}
// }

function initZoom() {
	d3.select('svg')
		.call(zoom);
}

function handleZoom(e) {
	console.log('handle zoom')
	d3.select('svg g')
		.attr('transform', e.transform);
		    // TO-DO select a section to zoom in 
    // Pop up year selection
}

function zoomIn() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleBy, 5);
		avg_markets = false;

		console.log("displaying all markets");
		displayAllMarkets("../data/subset_data/city_locations.csv");

}

function zoomOut() {
	d3.select('svg')
		.transition()
		.call(zoom.scaleBy, 0.5);
		avg_markets = true;
		displayAverageMarkets("../data/subset_data/num_markets.csv");

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

initZoom();
// updateData();
