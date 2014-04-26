var w = 1024;
var h = 768;


d3.json("/bdw/data/bicing.json", function (bcnrt) {

	// spanya

	// Latitude, Longitude
	// 41.375005,2.149136

	console.log(bcnrt.data.stationName);

	// Glories
	var originLatitude = 41.403403;
	var originLongitude = 2.187052;

	var projection = d3.geo.mercator()
        .rotate([(0 - originLongitude), (0 - originLatitude), -45])
        .scale(420000)
        .translate([w/2 + 215, h/2 + 88]);

	var path = d3.geo.path()
	    .projection(projection);

	var bcnLatlong = [];
	var bcnPoints = [];

	var markPointEspanya = [];
	var markPointGlories = [];

	for (var key in bcnrt) {
	    bcnLatlong.push([+bcnrt[key].geo.info.lng, +bcnrt[key].geo.info.lat]);
	    bcnPoints.push(projection([+bcnrt[key].geo.info.lng, +bcnrt[key].geo.info.lat]));
	}

	markPointEspanya.push(projection([2.149136, 41.375005]));
	markPointGlories.push(projection([2.187052, 41.403403]));

    var svg = d3.select("body").insert("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "Greys")
        	.append("svg:g")
            .attr("class", "cells");

            var points = svg.selectAll("g")
            	.data(bcnPoints)
            	.enter().append("svg:circle")
            	.attr("cx", function(d) {
            		return d[0];
            	})
            	.attr("cy", function(d) {
            		return d[1];
            	})
            	.attr("r", 2)
            	.attr("fill", function(d, i) {
        			return "#0C0";
            	})
            	.on("click", function(d, i) {
            		getPhoto(bcnLatlong[i][0], bcnLatlong[i][1]);
            	})

        var infoPointEspanya = svg.append("g").append("path")
			.attr("d", d3.svg.symbol()
			.size( function(d) { return 50; })
			.type( function(d) { return d3.svg.symbolTypes[1]; }))
			.attr("transform", "translate("+markPointEspanya[0][0]+", "+markPointEspanya[0][1]+")")
			.style("fill", "black");

        var infoPointGlories = svg.append("g").append("path")
			.attr("d", d3.svg.symbol()
			.size( function(d) { return 50; })
			.type( function(d) { return d3.svg.symbolTypes[1]; }))
			.attr("transform", "translate("+markPointGlories[0][0]+", "+markPointGlories[0][1]+")")
			.style("fill", "red");
});


		
