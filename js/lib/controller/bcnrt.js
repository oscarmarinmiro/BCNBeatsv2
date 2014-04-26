
var beatsviz = beatsviz || {'version':0.1, 'controller':{}, 'viz': {} ,'extras': {} };


beatsviz.controller.bcnRT = function(options)
{

    // Referencia a esta instancia

    var self = {};


    // Inits

    self.dataIn = "all";

    // Copies





    self.footerInfo= '<!-- AddThis Button BEGIN -->'+
		'<div class="addthis_toolbox addthis_default_style " style="padding:5px 0px 0px 0px">'+
			'<a class="addthis_button_facebook_like" fb:like:layout="button_count"></a>'+
			'<a class="addthis_button_tweet"></a>'+
			'<a class="addthis_counter addthis_pill_style"></a>'+
		'</div>'+
		'<script type="text/javascript">var addthis_config = {"data_track_addressbar":false};</script>'+
		'<script type="text/javascript" src="http://s7.addthis.com/js/250/addthis_widget.js#pubid=ra-4ff19d7370b136b3"></script>'+
		'<!-- AddThis Button END -->';



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
                  '<h1>BCN.citybeats - <span class="opcionesContent" id="showTime">----/--/-- | --:--:--</span><span class="opcionesContent"> - Mouseover elements for more info - For a full project description click <a href="http://outliers.es/en/2013/05/bcnbeats" target="_blank"> here</a></span></h1>',
                  '<div class="selector-holder"><h4>Choose Source:</h4> <select id="dataset" style="width:100px;">',
                    '<option value="all" selected>all</option>',
                    '<option value="bicing">bicing</option>',
                    '<option value="instagram">instagram</option>',
                    '<option value="traffic">transit</option>',
                    '<option value="foursquare">foursquare</option>',
                    '<option value="twitter">twitter</option>',
                  '</select></div>',
                '</header>',
                '<div id="chartContent" class="chartContent"></div>',
                '<div id="zonaInfo" class="zonaInfo">',
                    '<div class="legend">',
                      '<h4>Color key</h4>',
                      '<div id="legendContent" class="legendContent"></div>',
                    '</div>',
                '</div>',
                '<footer id="footer" class="footer"><p>'+self.footerInfo+'</p></footer>',
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

               $('#showTime').html(moment().format('MMMM Do YYYY | h:mm:ss a'));


               $('#dataset').change(function(){

                   self.dataIn = this.value;


                   self.bcnChart.render(self.netData,self.dataIn);

                   $('#showTime').html(moment().format('MMMM Do YYYY | h:mm:ss a'));

               });


               self.refreshData = function ()
               {
                           d3.json(self.urlBase, function(netData)
                            {
                                if(netData!=null)
                                {
                                           self.netData = netData;

                                           // primer render

                                           self.bcnChart.render(self.netData,self.dataIn);

                                           $('#showTime').html(moment().format('MMMM Do YYYY | h:mm:ss a'));
                                }
                            });
               }

               setInterval(self.refreshData, self.refreshInt);

           }
           else
           {
               myLog("Could not load file: "+self.baseJUrl+self.EVENTS_FILE,1);
           }
        });

        $("#dataset").select2({
          minimumResultsForSearch: 99999
        });
    });
}
