var beatsviz = beatsviz || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };


beatsviz.viz.bcnRT =  function (options)
{

    // Object

    var self = {};

    // Global vars
    // Tetuan: 41.394872,2.175593
    // Glories: 41.403403, 2.187052
    // Corsega/S.Juan: 41.40189,2.166324

    self.originLatitude = 41.40189;
	self.originLongitude = 2.166324;
	self.originLongitude = 2.166324;

    // Get options data

    for (key in options){
        self[key] = options[key];
    }

    self.parentSelect = "#"+self.idName;

    self.init = function()
    {


        // svg init

        self.myLog("Iniciando network diagram... en ",3);
        self.myLog(self.parentSelect,3);
        self.svg = d3.select(self.parentSelect).append("svg")
            .attr("width",self.width)
            .attr("height",self.height)
            .call(d3.behavior.zoom().on("zoom", self.redraw))
            .append("g");

        // projection and path info


	    self.projection = d3.geo.mercator()
            .rotate([(0 - self.originLongitude), (0 - self.originLatitude), -45])
            .scale(448500)
            .translate([self.width/2 + 7, self.height/2 + 8 ]);

	    self.path = d3.geo.path()
	       .projection(self.projection);

        var leftDisplacement = self.width/2 + 215;
        var topDisplacement = self.height/2 + 88;

        self.bcnLatlong = [];
	    self.bcnPoints = [];

	    self.markPointEspanya = [];
	    self.markPointGlories = [];


        self.legendSVG = d3.select("#"+self.legendId).append("svg")
            .attr("width",100)
            .attr("height",150)
            .append("g");


        for (var i in self.scaleType.domain())
        {

            var company = self.scaleType.domain()[i];


            self.legendSVG
                .append("circle")
                .attr("class","legendNodes")
                .style("fill",self.scaleType(company))
                .attr("cx",10)
                .attr("cy",30+(i*25))
                .attr("r",5);

            self.legendSVG
                .append("text")
                .attr("class","legendTexts")
                .attr("x",20)
                .attr("y",34+(i*25))
                .text(company);
        }

        // warning message

        self.warningMessage = self.svg.append("text")
            .attr("text-anchor", "middle")
            .attr("class","netChartTextWarning")
            .attr("x", self.width/2)
            .attr("y",self.height/2)
            .text(self.loadingMessage);



    }

    self.render = function(data,dataIn)
    {

        self.data = data;

        self.dataIn = dataIn;


        d3.selectAll(".circleDraw").remove();
        d3.selectAll(".lineDraw").remove();

        if(self.dataIn=='bicing' || self.dataIn=='all')
        {

            self.drawPoints = [];
            self.dataPoints = [];


            for(var i in self.data)
            {
                var point = self.data[i];

                if(point.type=='bicing')
                {

                    self.drawPoints.push(self.projection([point.geo.info.lng, point.geo.info.lat]));
                    self.dataPoints.push(point);


                    self.points = self.svg.selectAll("circle.bicing")
                                .data(self.dataPoints)
                                .enter().append("svg:circle")
                                    .attr("cx", function(d,j) {
                                            return Math.floor(self.drawPoints[j][0]);
                                    })
                                    .attr("cy", function(d,j) {

                                            return Math.floor(self.drawPoints[j][1]);
                                    })
                        .attr("r",0)
                        .style("opacity",0.7)
                        .attr("class","circleDraw bicing")
                         .style("fill", function(d, j) {
                                        return (self.scaleType("bicing"));
                                    });

                        self.points.append("title").text(function(d,j){return self.dataPoints[j].data.stationName+" - "+self.dataPoints[j].data.slots.free+" free slots";});

                        self.points.transition().duration(self.transTime)
                        .attr("r", function(d,j){var scale= self.sizeScale['bicing'];var point = self.dataPoints[j]; return Math.floor(scale(point.data.slots.occupation))});


                }
            }

        }

        if(self.dataIn=='twitter' || self.dataIn=='all')
        {

            self.drawPoints = [];
            self.dataPoints = [];


            for(var i in self.data)
            {
                var point = self.data[i];

                if(point.type=='twitter')
                {

                    self.drawPoints.push(self.projection([point.geo.info.lng, point.geo.info.lat]));
                    self.dataPoints.push(point);


                    self.points = self.svg.selectAll("circle.twitter")
                                .data(self.dataPoints)
                                .enter().append("svg:circle")
                                    .attr("cx", function(d,j) {
                                            return Math.floor(self.drawPoints[j][0]);
                                    })
                                    .attr("cy", function(d,j) {

                                            return Math.floor(self.drawPoints[j][1]);
                                    })
                        .attr("r",0)
                        .style("opacity",0.7)
                        .attr("class","circleDraw twitter")
                         .style("fill", function(d, j) {
                                        return (self.scaleType("twitter"));
                                    });

                        self.points.append("title").text(function(d,j){return "@"+self.dataPoints[j].data.from_user+" - "+self.dataPoints[j].data.text;});

                        self.points.transition().duration(self.transTime)
                        .attr("r", 5);


                }
            }

        }




        if(self.dataIn=='foursquare' || self.dataIn=='all')
        {

            self.drawPoints = [];
            self.dataPoints = [];


            for(var i in self.data)
            {
                var point = self.data[i];

                if(point.type=='foursquare')
                {
                    self.drawPoints.push(self.projection([point.geo.info.lng, point.geo.info.lat]));
                    self.dataPoints.push(point);

                    self.points = self.svg.selectAll("circle.foursquare")
                                .data(self.dataPoints)
                                .enter().append("svg:circle")
                                    .attr("cx", function(d,j) {
                                            return Math.floor(self.drawPoints[j][0]);
                                    })
                                    .attr("cy", function(d,j) {
                                            return Math.floor(self.drawPoints[j][1]);
                                    })
                        .attr("r",0)
                        .style("opacity",0.7)
                        .attr("class","circleDraw foursquare")
                         .style("fill", function(d, j) {
                                        return (self.scaleType("foursquare"));
                                    });

                        self.points.append("title").text(function(d,j){return self.dataPoints[j].data.name + " - " + self.dataPoints[j].data.checkins+" checkins"});

                        self.points.transition().duration(self.transTime)
                        .attr("r", function(d,j){var scale= self.sizeScale['foursquare'];var point = self.dataPoints[j]; return Math.floor(scale(point.data.checkins))});


                }
            }

        }

       if(self.dataIn=='instagram' || self.dataIn=='all')
        {

            self.drawPoints = [];
            self.dataPoints = [];


            for(var i in self.data)
            {
                var point = self.data[i];

                if(point.type=='instagram')
                {


                    self.drawPoints.push(self.projection([point.geo.info.lng, point.geo.info.lat]));
                    self.dataPoints.push(point);

                    self.points = self.svg.selectAll("circle.instagram")
                                .data(self.dataPoints)
                                .enter().append("svg:circle")
                                    .attr("cx", function(d,j) {
                                            return Math.floor(self.drawPoints[j][0]);
                                    })
                                    .attr("cy", function(d,j) {
                                            return Math.floor(self.drawPoints[j][1]);
                                    })
                        .attr("r",0)
                        .style("opacity",0.7)
                        .attr("class","circleDraw instagram")
                         .style("fill", function(d, j) {
                                        return (self.scaleType("instagram"));
                                    });

                        self.points
                        .on("click",function(d,i){window.open(d.data.link, '_blank');window.focus();});

                        self.points.append("title").text(function(d,j){
                            if(!self.dataPoints[j].data.caption) {
                                return self.dataPoints[j].data.user.username;
                            } else {
                                return self.dataPoints[j].data.user.username + "- "+ self.dataPoints[j].data.caption.text;
                            }
                        });

                        self.points.transition().duration(self.transTime)
                        .attr("r", function(d,j){var scale= self.sizeScale['instagram'];var point = self.dataPoints[j]; return Math.floor(scale(point.data.likes.count))});


                }
            }

        }


        if(self.dataIn=='traffic' || self.dataIn=='all')
        {

            self.drawLines = [];
            self.dataLines = [];


            for(var i in self.data)
            {
                var point = self.data[i];


                if(point.type=='traffic')
                {

                    var polygon = point.geo.info;

                    var polnumpoints = polygon.length-1;

                    for (var j=0;j<polnumpoints;j++)
                    {
                        self.dataLines.push({'first':self.projection([polygon[j][0], polygon[j][1]]),'second':self.projection([polygon[j+1][0], polygon[j+1][1]]),'now':point.data.now});
                    }


                }
            }



            self.lines = self.svg.selectAll("g")
                                .data(self.dataLines)
                                .enter().append("svg:line")
                                    .attr("x1", function(d,j) {
                                            return d.first[0];
                                    })
                                    .attr("y1", function(d,j) {
                                            return d.first[1];
                                    })
                                    .attr("x2", function(d,j) {
                                            return d.second[0];
                                    })
                                    .attr("y2", function(d,j) {
                                            return d.second[1];
                                    })
                        .attr("class","lineDraw")
                .attr("stroke",self.scaleType("traffic"))
                .attr("stroke-width",0)
                        .style("opacity",function(d,k){return self.sizeScale['traffic'](d.now);}).transition().duration(self.transTime).attr("stroke-width",function(d,k){return self.sizeScale['trafficW'](d.now);});


        }

        // El remove del warning esta al final porque el primer render tarda...

        self.warningMessage.transition().duration(self.transTime).style("opacity",0.0).remove();

    }

    // Main del objeto

    self.init();

    return self;

}

