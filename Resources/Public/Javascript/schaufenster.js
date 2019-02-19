
function getOpenAccessIcon(label) {
    var key = label.trim().substr(0, 4);
    switch (key) {
        case 'Open':
            return 'bel-schloss01';
        case 'zugr':
            return 'bel-schloss02';
    }
}

$(function() {
    $('body').show();
    $('body').append('<div class="alpha">αlpha</div>');
    /* Resolving language labels: */


    /* Removing all whitespaces around spans */
    $('dd span').each(function() {
        var that = $(this);

        that.text(that.text().trim());
    });

    // autolinking URLs:
    $('span').each(function() {
        var that = $(this);
        that.autolink();
    });

    // URNung:
    if ($('.field-identifierType').text() == 'URN') {
        var identifier = $('.field-identifier');
        var link = identifier.text();
        identifier.html('<a href="https://nbn-resolving.org/' + link + '">' + link + '</a>');
    }
    
    // Auto verlinkung
    $('.field-subject').each(function() {
        var that = $(this);
        var prop = that.text();
        var link = '<a href="?tx_find_find%5Bfacet%5D%5BSubjects%5D%5B###NEEDLE###%5D=1&tx_find_find%5Bcontroller%5D=Search#tx_find">' + prop + '</a>';
        that.html(link.replace('###NEEDLE###', encodeURI(prop)));
    });

    $('.field-publisher_facet').each(function() {
        var that = $(this);
        var prop = that.text();
        var link = '<a href="?tx_find_find[facet][publisher][###NEEDLE###]=1&tx_find_find[controller]=Search#tx_find">' + prop + '</a>';
        that.html(link.replace('###NEEDLE###', encodeURI(prop)));
    });


    $('.field-subject_ddc').each(function() {
        var that = $(this);
        var ddc = that.text();
        var ddctext = ddc_de[ddc.substr(0, 3)];
        var link = '<a href="?tx_find_find%5Bfacet%5D%5BFachgebiet%5D%5B###NEEDLE###%5D=1&tx_find_find%5Bcontroller%5D=Search#tx_find">DDC: ' + ddc + '</a>';
        that.html(link.replace('###NEEDLE###', encodeURI(ddc)) + ' (' + ddctext + ')');
    });

    $('.facetShowAll a').html('<span style="font-size:8pt">… zeige alle Facetten</span>');
    $('.fieldLabel[for="c-field-Suche"]').each(function() {
        var that = $(this);
        that.html('<a title="Zurück zur ungefilterten Suche" href="/suche/">' + that.text() + '</a>')
    });
    // adding fancyBox container:
    $('<div id="largeheatmapcontainer" style="display: none;"><div class="largeheatmap" /></div>').appendTo('body');


    // key icon for oa type:
    $('.facet-id-OpenAccess li ').each(function() {
        var that = $(this);
        that.prepend('<span class="resourcetype-icon ' + getOpenAccessIcon(that.attr('value')) + '"></span>');
    });

    // key icon for resultlist:
    $('.field-rightsOA').each(function() {
         const txt = $(this).text().trim();
         $(this).html('');
         if (txt == 'Open Access') $(this).append('<span title="'+txt+'" class="openaccess-icon bel-schloss01"></span>');
    });
    $('.field-abstract').each(function(){
        var that = $(this);
        that.html(that.html().replace(/&lt;/gm,'<').replace(/&gt;/gm	,'>'));
    }); 

    function renderLinks(links) {
       if (Array.isArray(links)) {
           var result="";
           links.forEach(function(url){
               if (!url.match('resolving'))
                  url= url.replace('urn:','https://nbn-resolving.org/urn:');
               const a = '<a title="Link zum externen Dokument" class="screenshot_preview" href="'+url+'">' + url +'</a>';
               const link = (url.match('\/\/doi\.org')) ? '<li><img src="typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/doi.png" width=14 /> ' + a : '<li>⇢ '+a;
               result += link;    
           });
           return result; 
       }    
    }
    $('.previewButton').click(function(){
        var that = $(this);
        const tileprovider = JSON.parse($('.resultList').attr('data-tileprovider'));
        const container = that.parent().parent().children().last();
        //container.css('height',0);
        if (that.text()=='▼') {
            that.text('');
          //  container.animate({height:container.outerHeight(true)},400)
            const url = '/?eID=detail&document=' + that.attr('data-id').replace('document_','')+ '&pid='+that.attr('data-pid');
            $.getJSON(url,function(doc){
                that.text('▲');
                   const mapid = 'mapview_'+ 999999999*Math.random(); 
                   var html ='<dl style="min-height:300px;;padding:0 10px 0 0;">';
                   if (doc.publisher) html+= '<dt>Herausgeber</dt><dd>'+doc.publisher+'</dd>'
                   if (doc.resourceType) html+= '<dt>Ressourcentyp</dt><dd>'+doc.resourceType+'</dd>';
                  if (doc.language) html+= '<dt>Sprache</dt><dd>'+doc.language+'</dd>'
                   html +=  '<dt>Jahr der Veröffentlichung</dt><dd>'+doc.publicationYear+'</dd>';
                   if (doc.abstract) html+= '<dt>Inhalt</dt><dd>'+doc.abstract+'</dd>'
                   if (doc.rights) html+= '<dt>Lizenz</dt><dd>'+doc.rights+'</dd>'
                    if (doc.url) {
                     html+= '<dt>Link</dt><dd><ul>'+renderLinks(doc.url)+'</ul></dd>'
                   }
                   html += '</dl>\n\n<div style="display:table-cell;height:420px;width:45%" id="'+mapid+'"></div>';
                   container.html(html);
                   $('.screenshot_preview').each(function() {
                       const that = $(this);
                       const id = 'preview_' + Math.random()*999999999;
                       return;
                       that.qtip({
                         content: {
                            text: function(event,api) {
                                 $.ajax({
                                  url: '/typo3conf/ext/hosfindfacetviews/Resources/Public/screencapture.php' ,
                                  type: 'POST',
                                  data: { 
                                   url :  that.attr('href')
                                  },
                                  error : function() {
                                      console.log('error');
                                  },
                                  success: function(data) {
                                      const img = $('.webpreview');
                                      img.attr('src',data).attr('width',200).attr('height',160);
                                      
                                }
                                });
                                return '<img class="webpreview" src="/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/ajax-loader.gif" width="32" height="32" data-id="'+id+'"/>';
                            }
                        },
                        style: {classes: 'qtip-dark qtip-shadow'}
                    });
                });
                renderMapview(mapid,doc,tileprovider);
            })
        } else {
          that.text('▼');
          container.html('');        
        }    
    });

    //$('#c3').append('<img style="cursor:pointer;position:absolute;top:0;right:0;filter:grayscale(0);" width=90 src="/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/color.jpg" id="colortoggler"/>');
    $('[title!=""]').qtip();
    (function() { /*  Handling of coloring/graying */
        var COLORING = 'COLORINGFLAG';

        function setColoring() {
            (!!$.cookie(COLORING)) ?
            $('body').addClass('grayscale'): $('body').removeClass('grayscale');
        }
        $('#colortoggler').click(function() {
            (!!$.cookie(COLORING)) ?
            $.removeCookie(COLORING): $.cookie(COLORING, '1', {
                expires: 777
            });
            setColoring();
        });
        setColoring();
    })();
});



function renderMapview(id,doc,tileprovider) {
    const latlng= doc.geoLocationPoint;

   if (tileprovider.type=='wms') {
                const endpoint = tileprovider.endpoint + tileprovider.service;
                const tileoptions = {
                        layers : tileprovider.layers,
                        retina : tileprovider.size.replace('@','').replace('x','') || 1,
                        attribution : 'Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung'//props.tileprovider.attribution
                };
                tileLayer = tileprovider.dsvgo || true 
                        ? L.tileLayer.wms( '/?eID=wms&endpoint='+ endpoint, tileoptions)
                        : L.tileLayer.wms(endpoint,tileoptions);
  }

    const mapoptions = {
      crs : L.CRS[tileprovider.crs.replace(':','')],
      layers : [tileLayer],
      maxZoom: tileprovider.maxzoom,
      minZoom : tileprovider.minzoom
   };
   
   const map = L.map(id,mapoptions).setView(latlng.split(','), 12);
   
  var collection = Collections[doc.collection];
  var icon =  '/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/' +collection + '.png';
  var logoUrl= '/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/' +collection + '_big.png';
  var Marker = L.icon({
       iconUrl: icon,
       popupAnchor:  [0, -20],
       iconSize:     [48, 48],
  });
  const logo = '<img style="margin:0 0 50 0" src="'+ logoUrl+ '" width="240" /><br/><br/>';
  var popupContent = logo + doc.title;
       L.marker(latlng.split(','), {
           icon: Marker
      }).addTo(map).bindPopup(popupContent).openPopup();
}
