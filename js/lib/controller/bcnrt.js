
var beatsviz = beatsviz || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };


beatsviz.controller.bcnRT = function(options)
{

    // Referencia a esta instancia

    var self = {};


    // Inits

    self.dataIn = "all";

    // Copies


    // Pongo lo que me venga por opciones en el self

    for (key in options){
        self[key] = options[key];
    }

    self.parentSelect = "#"+self.idName;

    // Funciones auxiliares

    function myLog(myString, level)
    {

        if ((self.debugLevel!=0)&&(level<=self.debugLevel))
        {
            console.log(myString);
        }
    }


    // El document ready

    $(document).ready(function()
    {
        // El cache del servidor manda

        $.ajaxSetup({cache: true});

        self.captionCounter = 0;

        // Inyecto el html en el div padre

        var injectString =
            ['<div id="contenedorTodo" class="wrapper">',
                '<header>',
//                  '<h1>BCN<span>Beats</span></h1>',
                    '<img src="img/BCNBeats_logo.png">',
                '</header>',
                '<div id="header2"><span class="opcionesContent" id="showTime">--:--:--</span></div>',
                '<div id="header3"><span class="opcionesContent" id="showTimeBelow">----/--/--</span></div>',
                '<div id="chartContent" class="chartContent"></div>',
                '<div id="zonaInfo" class="zonaInfo">',
                    '<div class="legend">',
                      '<h4>Color key</h4>',
                      '<div id="legendContent" class="legendContent"></div>',
                    '</div>',
                '</div>',
                '<div id="footer1"><img src="img/BCNBeats_leyendav2.png"></div>',
                '<div id="footer2"><span style="font-weight:600">Credits for this version</span></br><a href="http://www.outliers.es" target="_blank">Outliers Collective:</a> Concept, Data, Backend, Frontend</br> <span style="color:#CCC;">Rocío Márquez, Patricia Benítez:</span> Design</br><span style="color:#CCC;"><a href="http://vimeo.com/65518726" target="_blank">More info here</a></span></div>',
             '</div>'
            ].join('\n');




        $(self.parentSelect).html(injectString);


        // Instancio el objeto networkChart

        self.bcnChart = beatsviz.viz.bcnRT(
            {
                'visTitle':"BCN beats",
                'idName':"chartContent",
                'idInfo': self.idInfo,
                'width': $('#chartContent').width(),
                'height': $('#chartContent').height(),
                'transTime':self.transTime,
                'legendId':"legendContent",
                'loadingMessage':"Loading data...",
                'scaleType': self.scaleType,
                'sizeScale':self.sizeScale,
                'myLog':myLog
            });

        // Pido el fichero de datos

        d3.json(self.urlBase, function(netData)
        {
           if(netData!=null)
           {
               self.netData = netData;

               // primer render

               self.bcnChart.render(self.netData);

               $('#showTime').html(moment().format('H:mm:ss'));
               $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));

               self.dateInterval = null;
               self.dataInterval = null;


               self.refreshData = function ()
               {
//                    console.log("refreshData");

                           d3.json(self.urlBase, function(netData)
                            {
                                if(netData!=null)
                                {
                                           self.netData = netData;

                                           // primer render

                                           self.bcnChart.render(self.netData);

                                           $('#showTime').html(moment().format('H:mm:ss'));
                                           $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));

                                }

                            });
               };

               self.refreshDate = function()
               {
//                    console.log("refreshDate");
                    $('#showTime').html(moment().format('H:mm:ss'));
                    $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));

                   if(self.captionCounter%self.captionRatio==0)
                   {

                    self.bcnChart.showInfos();
                   }

                   self.captionCounter++;

               };


               self.dataInterval = setInterval(self.refreshData, self.refreshInt);

               self.dateInterval = setInterval(self.refreshDate, 1000);

//               console.log("JUST AFTER SET");
//               console.log(self.dataInterval);
//               console.log(self.dateInterval);

               $(window).blur(function(){
                   clearTimeout(self.dataInterval);
                   clearTimeout(self.dateInterval);

                   self.dateInterval = null;
                   self.dataInterval = null;

//                   console.log("BLUR...");

//                   console.log(self.dataInterval);
//                   console.log(self.dataInterval);
//                   console.log(self.dateInterval);

               });

               $(window).focus(function(){

//                   console.log("FOCUS...");

                   clearTimeout(self.dataInterval);
                   clearTimeout(self.dateInterval);

                   if(!self.dateInterval)
                   {
                        self.dateInterval = setInterval(self.refreshDate, 1000);
                   }

                   if(!self.dataInterval)
                   {
                        self.dataInterval = setInterval(self.refreshData, self.refreshInt);
                   }

//                   console.log(self.dataInterval);
//                   console.log(self.dateInterval);
               });



           }
           else
           {
               myLog("Could not load file: "+self.baseJUrl+self.EVENTS_FILE,1);
           }
        });

    });
};
