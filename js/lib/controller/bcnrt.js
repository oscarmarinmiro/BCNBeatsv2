
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

        // Inyecto el html en el div padre

        var injectString =
            ['<div id="contenedorTodo" class="wrapper">',
                '<header>',
                  '<h1>BCN<span>Beats</span></h1>',
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

               self.bcnChart.render(self.netData,self.dataIn);
               $('#showTime').html(moment().format('H:mm:ss'));
               $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));




               self.refreshData = function ()
               {
                           d3.json(self.urlBase, function(netData)
                            {
                                if(netData!=null)
                                {
                                           self.netData = netData;

                                           // primer render

                                           self.bcnChart.render(self.netData,self.dataIn);

                                           $('#showTime').html(moment().format('H:mm:ss'));
                                           $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));

                                }
                            });
               };

               self.refreshDate = function()
               {
                    $('#showTime').html(moment().format('H:mm:ss'));
                    $('#showTimeBelow').html(moment().format('MMMM Do YYYY'));
               };

               setInterval(self.refreshData, self.refreshInt);

               setInterval(self.refreshDate, 1000);


           }
           else
           {
               myLog("Could not load file: "+self.baseJUrl+self.EVENTS_FILE,1);
           }
        });

    });
};
