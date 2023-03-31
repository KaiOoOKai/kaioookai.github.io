
let zoom = d3.zoom()
	.scaleExtent([1, 5])
	.on('zoom', handleZoom);

function initZoom() {
	d3.select('svg')
		.call(zoom);
}

function handleZoom(e) {
	d3.select('svg g')
		.attr('transform', e.transform);

	scaledRadius = e.transform.k;
	d3.selectAll("circle")
	.attr("r", rScale(scaledRadius))

	// TO-DO select a section to zoom in 
}

initZoom();
