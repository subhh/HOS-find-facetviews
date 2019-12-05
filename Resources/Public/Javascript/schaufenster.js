
function getOpenAccessIcon(label) {
    var key = label.trim().substr(0, 4);
    switch (key) {
        case 'Open':
            return 'bel-schloss01';
        case 'zugr':
            return 'bel-schloss02';
    }
}

function getIntWithDot(intString){
    var intStringWithDot = intString.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');

    return intStringWithDot;
}


function getOG() {
   const that=$(this);
   $.ajax({
     url:'?eID=og&site='+ encodeURIComponent(that.attr('href'))
     }).done(function(og){
          console.log(og);
          });
}


function addPreviewToUrl() {
        console.log('######');
        const that= $(this);
	that.css('opacity',0.8);
	const imageurl = '?eID=thumbnail&site='+ encodeURIComponent(that.attr('href')); 
	$.ajax(imageurl).done(function(){
	    that.css('opacity',1);
	    console.log(imageurl + ' cached');
	    
        const BERT = '/typo3conf/ext/hosfindfacetviews/Resources/Public/assets/bert.gif';
	const id = (''+Math.random()).replace('0.','экстернlink_');

	const text = 'Externer Link, keine Gewähr für den Inhalt<br/><img width="100%" src="'+BERT+'" />';
	that.qtip({
	        prerender:true,
		content: {
			text:function(event,api){
				$.ajax({ url: imageurl }).done(function(img) {
					const txt = text.replace(BERT,img);
					api.set('content.text',txt)
				});
				return text;
			}
		},
		position: {
                 target: 'mouse', // Position at the mouse...
             adjust: { mouse: false } // ...but don't follow it!
    },
		style : {classes:'qtip-dark'}
	});
	    
        }); // precaching

}


function setResultCounterDecimalSeperator(){
    const SEP = /([0-9]+)([\D]+)([0-9]+)/;
    
    var resultCountnewString = $(".top .resultCountnew").text().trim();
    if( (resultCountnewString == "") || (resultCountnewString == "keine Treffer") ){
	$("#tx_find .navigation").css("display", "none");
	return false;
    }

    const REGEX = /\s+/gi;

    resultCountnewString = resultCountnewString.replace(REGEX, ' ');
    var splitStringArray = resultCountnewString.split(" ");

    if ( splitStringArray.length > 1){
        var end = '';
        var begin = '';

        //begin
        
        var subSplitStringArray = splitStringArray[0].match(SEP);
        if (!subSplitStringArray) return;
        if (subSplitStringArray.length > 1){
            begin = getIntWithDot(subSplitStringArray[1])+subSplitStringArray[2]+getIntWithDot(subSplitStringArray[3]);
        }else{
	    begin = splitStringArray[0];
        }
        //end
        if ( splitStringArray.length > 2){
            end = getIntWithDot(splitStringArray[2]);
        }
        
        //combine - if results <100 end is empty
        var newString = begin+' '+splitStringArray[1]+' '+end;

        //set new text
        $(".top .resultCountnew").text(newString);
        $(".bottom .resultCountnew").text(newString);
    }
}

$(function() {
    setResultCounterDecimalSeperator();
    //     $('.tx_find [title!=""]').qtip({
    //     position: {
    //       at : 'center-bottom'
    //     },
    //      position: {
    //              target: 'mouse', // Position at the mouse...
    //          adjust: { mouse: false }} ,
    //     style: {
    //       classes : 'qtip-dark'
    //     }
    // });
 //   $('.field-url-group .field-url a').each(getOG);
    $('.field-url a.externalLinkHasPreview').each(addPreviewToUrl);
    // altmetrics
    $('.detail').each(function() {
         const that = $(this); 
         const urls = that.data('altermetrics_url');
         var am = {type:null,id:null};
         var m;
         urls.forEach(function(url) {
         if (m = url.match(/doi\.org\/(.*)/)) {
           am.type = 'doi';
           am.id = m[1];            
        }
         else if (m = url.match(/pubmed\/([\d]+)/)) {
            am.type = 'pmid';
            am.id=m[1];
         }
          else if (m = url.match(/ISBN:(.*)/)) {
            am.type = 'isbn';
            am.id=m[1];
         }});
         $.ajax({url: '?eID=altmetrics&type='+am.type+'&id='+am.id}).then(function(content) {
             const id = ('altmetricslink_'+ Math.random()).replace('.','');
             const link = '<a id="'+id+'" href="' + content.details_url+'" taget="altmetrics"><img width=42 src="'+content.images.small+ '" /></a>';
             $('h1').prepend(link);
             $('#'+id).each(addPreviewToUrl);
        });
    });     
    
    // Handling of long creatorName lists:
    $('ul.field-creatorName-group .facetShowAll').click(function(){
       const that = $(this);
       var ul = that.parent();
       $('li',ul).each(function(){
          $(this).show();
       })
       that.hide();
       $('ul.field-creatorName-group .facetShowLess').show();
    });
    $('ul.field-creatorName-group .facetShowLess').click(function(){
       const that = $(this);
       var ul = that.parent();
       $('li.hiddenli').each(function(){
          $(this).hide();
       })
       that.hide();
       $('ul.field-creatorName-group .facetShowAll').show();
    });
    
    
     
    // decimal separator in facetCounts:
    $('.facetCount').each(function() {
        var that = $(this);
        var v = parseInt(that.text());
        v = v.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
        that.text(v);
    });
    /* Removing all whitespaces around spans */
    $('dd span').each(function() {
        var that = $(this);
        
        //because links in detail page changed to text
        if(this.className != 'field-url'){
            that.text(that.text().trim());
        } 
    });
    // autolinking URLs:
    $('.leftbox dd span').each(function() {
        var that = $(this);
        that.autolink();
    });

    // URNung:
    if ($('.field-identifierType').text() == 'URN') {
        var identifier = $('.field-identifier');
        var link = identifier.text();
        identifier.html('<a href="https://nbn-resolving.org/' + link + '">' + link + '</a>');
    }


    $('.field-subject_ddc').each(function() {
        var that = $(this);
        var ddc = that.text();
        var ddctext = ddc_de[ddc.substr(0, 3)];
        var link = '<a href="?tx_find_find%5Bfacet%5D%5BFachgebiet%5D%5B###NEEDLE###%5D=1&tx_find_find%5Bcontroller%5D=Search#tx_find">DDC: ' + ddc + '</a>';
        that.html(link.replace('###NEEDLE###', encodeURI(ddc)) + ' (' + ddctext + ')');
    });

    $('.facetShowAll a').html('<span style="font-size:8pt">Zeige mehr</span>');
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
    $('#facetsonoff').on('click',function(){toggleFacets()});
    $('.previewButton').click(function(){
        var that = $(this);
        const container = that.parent().parent().children().last();
        //container.css('height',0);
        if (that.text()=='▼') {
            that.text('');
          //  container.animate({height:container.outerHeight(true)},400)
            const url = '/?eID=detail&document=' + that.attr('data-id').replace('document_','')+ '&pid='+that.attr('data-pid');
            $.getJSON(url,function(doc){
                const tileprovider = $('.heatmapContainer').data('tileprovider');
                that.text('▲');
                
                 const mapid = 'mapview_'+ 999999999*Math.random(); 
                   var html ='<div style="min-height:360px;overflow:hidden;width:100%">' +
                   '<dl style="float:left;width:49%;padding:0 10px 10px 0;">';
                   if (doc.publisher) html+= '<dt>Herausgeber</dt><dd>'+doc.publisher+'</dd>'
                   if (doc.resourceType) html+= '<dt>Ressourcentyp</dt><dd>'+doc.resourceType+'</dd>';
                  if (doc.language) html+= '<dt>Sprache</dt><dd>'+doc.language+'</dd>'
                   html +=  '<dt>Jahr der Veröffentlichung</dt><dd>'+doc.publicationYear+'</dd>';
                   if (doc.abstract) html+= '<dt>Inhalt</dt><dd>'+doc.abstract+'</dd>'
                   if (doc.rights) html+= '<dt>Lizenz</dt><dd>'+doc.rights+'</dd>'
                   html += '</dl>\n<div  id="'+mapid+'"  style="float:left;background-color:#08659BAC;min-height:460px;width:49%;border:1px dotted silver">'
                   + '</div></div>';
                   container.html(html);
              renderMapview(mapid,doc,tileprovider);
            })
        } else {
          that.text('▼');
          container.html('');        
        }    
    });
    $('main').fadeTo(100,1.0);

    $("#discover-handle select").change(function() {
        $("#tx_find form").submit();
    });
});



function toggleFacets() {
  if ($('body').hasClass('facetson'))
  {
    $('body').removeClass('facetson');
  }
  else
  {
    $('body').addClass('facetson');
  }
};

function renderMapview(id,doc,tileprovider) {
    const latlng= doc.internal_geoLocation_facet;
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
   
  //var collection = Collections[doc.collection];
  //var icon =  '/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/' +collection + '.png';
  var logoUrl= '/fileadmin/discovery/assets/institutions/' + encodeURI(doc.internal_institution_id) + '_big.png';
  
  var Marker = L.icon({
     //  iconUrl: icon,
       popupAnchor:  [0, -20],
       iconSize:     [48, 48],
  });
  const logo = '<img style="margin:0 0 50 0" src="'+ logoUrl+ '" width="280" height="90" alt="Logo"/><br/><br/>';
  var popupContent = logo + doc.title;
       L.marker(latlng.split(','), {
    //       icon: Marker
      }).addTo(map).bindPopup(popupContent).openPopup();
}

