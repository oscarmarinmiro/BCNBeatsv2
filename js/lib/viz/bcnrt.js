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
            .append("g");

        // projection and path info


	    self.projection = d3.geo.mercator()
            .rotate([(0 - self.originLongitude), (0 - self.originLatitude), -45])
            .scale(448500)
            .translate([self.width/2 + 7, self.height/2 + 8 ]);

	    self.path = d3.geo.path()
	       .projection(self.projection);


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


        self.dataLines = [];
        self.dataPoints = [];



    };

    self.getIdFromPoint = function(datum,i)
    {
        if(datum.type=="instagram")
        {
            return datum.data.id;
        }
        else
        {
            if(datum.type=="bicing")
            {
                return datum.data.id;
            }
            else
            {
                if(datum.type=="twitter")
                {
                    return datum.data.id;
                }
                else
                {
                    if(datum.type=="foursquare")
                    {
                        return datum.data.name;
                    }
                    else
                    {
                        return i;
                    }
                }
            }
        }
    };

    self.pointScaleData = function(datum,i)
    {
        if(datum.type=="instagram")
        {
            return datum.data.likes.count;
        }
        else
        {
            if(datum.type=="bicing")
            {
                return datum.data.slots.occupation;
            }
            else
            {
                if(datum.type=="twitter")
                {
                    return 1.0;
                }
                else
                {
                    if(datum.type=="foursquare")
                    {
                        return datum.data.checkins;
                    }
                    else
                    {
                        return 1.0;
                    }
                }
            }
        }

    };

    self.render = function(data)
    {


        self.data = data;


//        d3.selectAll(".circleDraw").remove();
        d3.selectAll(".lineDraw").remove();

        // Traffic

            self.dataLines.length = 0;
            self.dataPoints.length = 0;

        // Prepara a dataLines array to attach
        // And a dataPoints to attach


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
                else
                {
                    self.dataPoints.push(point);
                }
            }



            self.lines = self.svg.selectAll(".lineDraw")
                                .data(self.dataLines);

            self.lines.exit().remove();

            self.lines.attr("stroke",function(d,k){
                    if(d.now>=1.0)
                    {
                        return self.sizeScale['trafficC'](d.now+(Math.random()*2)-1);
                    }
                    else
                    {
                        return self.sizeScale['trafficC'](d.now);
                    }})
                .attr("stroke-width",0)
                        .style("opacity",function(d,k){return self.sizeScale['traffic'](d.now+(Math.random()*2)-1);}).transition().duration(self.transTime).attr("stroke-width",function(d,k){return self.sizeScale['trafficW'](d.now+(Math.random()*2)-1);});


            var enteringLines = self.lines.enter().insert("svg:line",".circleDraw")
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
                .attr("stroke",function(d,k){
                    if(d.now>=1.0)
                    {
                        return self.sizeScale['trafficC'](d.now+(Math.random()*2)-1);
                    }
                    else
                    {
                        return self.sizeScale['trafficC'](d.now);
                    }})
                .attr("stroke-width",0)
                        .style("opacity",function(d,k){return self.sizeScale['traffic'](d.now+(Math.random()*2)-1);});

            enteringLines.append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",function(d,k){var inicial = self.sizeScale['traffic'](d.now+(Math.random()*2)-1); return inicial+";"+(inicial*1.5)+";"+inicial}).attr("dur","2s").attr("repeatCount","indefinite");

            enteringLines.transition().duration(100).attr("stroke-width",function(d,k){return self.sizeScale['trafficW'](d.now+(Math.random()*2)-1);});


        // Points


        self.points = self.svg.selectAll(".circleDraw").data(self.dataPoints,function (d,i){return self.getIdFromPoint(d,i)});

        self.points.exit().transition().duration(self.transTime)
            .attr("opacity",0.0)
            .attr("cy",2000).remove();

        self.points.attr("r", function(d,j){var scale= self.sizeScale[d.type]; return Math.floor(scale(self.pointScaleData(d,i)));});



        var enteringPoints = self.points.enter().append("svg:circle")
                                    .attr("cx", function(d,j) {
                                            return Math.floor(self.projection([d.geo.info.lng, d.geo.info.lat])[0]);
                                    })
                                    .attr("cy", function(d,j) {
                                                            return Math.floor(self.projection([d.geo.info.lng, d.geo.info.lat])[1]);
                                                    })
                                    .style("opacity",function(d,i){ if (d.type=="foursquare"){return 0.3;} else {return 0.7;}})
                            .attr("r", function(d,j){var scale= self.sizeScale[d.type]; return Math.floor(scale(self.pointScaleData(d,i))*3);})
                        .attr("class",function(d,i){ return "circleDraw " + d.type})
                        .style("fill", function(d, j) {
                                        return (self.scaleType(d.type));
                                    })
                                    .style("stroke","white")
            .style("stroke-width",function(d,i){return d3.select(this).attr("r")/10;})
            .style("stroke-opacity",1.0);


//                        self.points.append("title").text(function(d,j){return self.dataPoints[j].data.stationName+" - "+self.dataPoints[j].data.slots.free+" free slots";});

        enteringPoints.each(function(d,i)
        {
            if(d.type=="foursquare")
            {
                d3.select(this).append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",
            function(d,i)
            {
                var seed = 0.3+(Math.random()*0.05);
                return seed+";"+(seed+0.05)+";"+seed;
            })
            .attr("dur","3s")
            .attr("repeatCount","indefinite");
            }
        });

        enteringPoints.transition().duration(self.transTime)
                            .attr("r", function(d,j){var scale= self.sizeScale[d.type]; return Math.floor(scale(self.pointScaleData(d,i)));})
            .style("stroke-width",0.0);





        console.log("TAMANYOS");
        console.log(d3.selectAll(".lineDraw").size());
        console.log(d3.selectAll(".circleDraw").size());



//        console.log(enteringPoints.selectAll(".foursquare"));


//        enteringPoints.classed("foursquare").append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",
//            function(d,i)
//            {
//                console.log(d);
//                var seed = 0.1+(Math.random()*0.05);
//                return seed+";"+(seed+0.05)+";"+seed;
//            })
//            .attr("dur","3s")
//            .attr("repeatCount","indefinite");
//

        //                    var seed = 0.1+(Math.random()*0.05);
//                    self.point.append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",seed+";"+(seed+0.05)+";"+seed).attr("dur","3s").attr("repeatCount","indefinite");
//
//                    self.pointSmall = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",1)
//                        .style("opacity",1.0)
//                        .attr("class","circleDraw foursquareSmall")
//                         .style("fill", function(d, j) {
//                                    return "#797";
//                                    });

//        self.points.attr("lala",function(d,i){console.log(d);return "lala"});



//        // Bicing
//
//
//
//            for(var i in self.dataPoints)
//            {
//                var point = self.dataPoints[i];
//
//                if(point.type=='bicing')
//                {
//
//                    self.point = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",0)
//                        .style("opacity",0.7)
//                        .attr("class","circleDraw bicing")
//                         .style("fill", function(d, j) {
//                                        return (self.scaleType("bicing"));
//                                    });
//
////                        self.points.append("title").text(function(d,j){return self.dataPoints[j].data.stationName+" - "+self.dataPoints[j].data.slots.free+" free slots";});
//
//                        self.point.transition().duration(self.transTime)
//                        .attr("r", function(d,j){var scale= self.sizeScale['bicing']; return Math.floor(scale(point.data.slots.occupation))});
//
//
//                }
//            }
//
//
//
//            // Twitter
//
//            for(var i in self.dataPoints)
//            {
//                var point = self.dataPoints[i];
//
//                if(point.type=='twitter')
//                {
//
//
//                    self.point = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",0)
//                        .style("opacity",0.7)
//                        .attr("class","circleDraw twitter")
//                         .style("fill", function(d, j) {
//                                        return (self.scaleType("twitter"));
//                                    });
//
////                        self.points.append("title").text(function(d,j){return "@"+self.dataPoints[j].data.from_user+" - "+self.dataPoints[j].data.text;});
//
//                        self.point.transition().duration(self.transTime)
//                        .attr("r", self.sizeScale['twitter'](1.0));
//
//
//                }
//            }
//
//
//
//
//        // Foursquare
//
//            for(var i in self.dataPoints)
//            {
//                var point = self.dataPoints[i];
//
//                if(point.type=='foursquare')
//                {
//
//                    self.point = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",0)
//                        .style("opacity",0.15)
//                        .attr("class","circleDraw foursquare")
//                         .style("fill", function(d, j) {
//                                        return (self.scaleType("foursquare"));
//                                    });
//
////                        self.points.append("title").text(function(d,j){return self.dataPoints[j].data.name + " - " + self.dataPoints[j].data.checkins+" checkins"});
//
//                        self.point.transition().duration(self.transTime)
//                        .attr("r", function(d,j){var scale= self.sizeScale['foursquare'];return Math.floor(scale(point.data.checkins))});
//
//
//
//                    var seed = 0.1+(Math.random()*0.05);
//                    self.point.append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",seed+";"+(seed+0.05)+";"+seed).attr("dur","3s").attr("repeatCount","indefinite");
//
//                    self.pointSmall = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",1)
//                        .style("opacity",1.0)
//                        .attr("class","circleDraw foursquareSmall")
//                         .style("fill", function(d, j) {
//                                    return "#797";
//                                    });
//
//
//
//                }
//
//            }
//
//
//
//
//        // Instagram
//
//
//            for(var i in self.dataPoints)
//            {
//                var point = self.dataPoints[i];
//
//                if(point.type=='instagram')
//                {
//
//
//                    self.point = self.svg.append("svg:circle")
//                                    .attr("cx", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[0]);
//                                    })
//                                    .attr("cy", function(d,j) {
//                                            return Math.floor(self.projection([point.geo.info.lng, point.geo.info.lat])[1]);
//                                    })
//                        .attr("r",0)
//                        .style("opacity",0.7)
//                        .attr("class","circleDraw instagram")
//                         .style("fill", function(d, j) {
//                                        return (self.scaleType("instagram"));
//                                    });
//
////                        self.points
////                        .on("click",function(d,i){window.open(d.data.link, '_blank');window.focus();});
//
////                        self.points.append("title").text(function(d,j){
////                            if(!self.dataPoints[j].data.caption) {
////                                return self.dataPoints[j].data.user.username;
////                            } else {
////                                return self.dataPoints[j].data.user.username + "- "+ self.dataPoints[j].data.caption.text;
////                            }
////                        });
//
////                    var seed = 0.3+(Math.random()*0.1);
//
////                    self.points.append("animate").attr("attributeName","opacity").attr("attributeType","XML").attr("values",seed+";"+(seed+0.6)+";"+seed).attr("dur","2s").attr("repeatCount","indefinite");
//
//                    self.point.transition().duration(self.transTime)
//                        .attr("r", function(d,j){var scale= self.sizeScale['instagram']; return Math.floor(scale(point.data.likes.count))});
//
//
//                }
//            }


        // El remove del warning esta al final porque el primer render tarda...

        self.warningMessage.transition().duration(self.transTime).style("opacity",0.0).remove();

    };

    // Main del objeto

    self.init();

    return self;

};

