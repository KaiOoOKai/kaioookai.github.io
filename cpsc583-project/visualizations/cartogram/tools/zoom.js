
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
	// .style("stroke-opacity", rScale(1/scaledRadius))    // set the stroke width
	// console.log(1/scaledRadius)
}

initZoom();
