const MAXCREATORS = 8, MAXTITLE=200;


function createMapView(fields,tileprovider) {
   /* helper functions for limitation of popup height */
   function getCreatorsString(creators) {
     if (typeof creators == 'string') {
       return creators;
     }
     if (typeof creators == 'undefined') {
           return '';
     }
     if (creators.length<MAXCREATORS) {
       return creators.join(', ');
     }
     return creators.slice(0,MAXCREATORS).join(', ') + '&nbsp;…';
   }
   
   function getTitleString(title) {
        return title.length<MAXTITLE ? title : title.substr(0,MAXTITLE) + '&nbsp;…';
   }

  
  /* creating map */
  if (!fields) return;
  var  latlng = fields.internal_geoLocation_facet.split(',');
  
  const endpoint = tileprovider.endpoint + tileprovider.service;
  const tileLayer =  L.tileLayer.wms( '/?eID=wms&endpoint='+ endpoint, {
        layers : tileprovider.layers,
        retina : tileprovider.size ? tileprovider.size.replace('@','').replace('x','') || 1: 2,
        attribution : 'Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung'
  });
  const Map = L.map('map',{
      crs : L.CRS[tileprovider.crs.replace(':','')],
      layers : [tileLayer],
      maxZoom: tileprovider.maxzoom,
      minZoom : tileprovider.minzoom
   }).setView(latlng, 15);
   const ASSETS = '/typo3conf/ext/hosfindfacetviews/Resources/Public/assets/institutions/';
   var Marker = L.icon({
       iconUrl: ASSETS + fields.internal_institution_id + '.png',
       popupAnchor:  [0, -20],
       iconSize:     [25, 25],
  });
   const logo = '<img width="180" src="'+ ASSETS + encodeURI(fields.internal_institution_id) + '_big.png" alt=""/>';
   const popupContent = logo +'<p><i style="font-style:cursiv">'+ getCreatorsString(fields.creatorName)+'</i></p><p><b>' + getTitleString(fields.title.join(', '))+'</b></p>';
   const pin =L.marker(latlng, {
          icon: Marker
      }).addTo(Map);
   const popup = L.popup({maxWidth:200});
   popup.setContent(popupContent);   
   pin.bindPopup(popup).openPopup();
   const X =  parseFloat(Map._size.x)/2;
   const Y = parseFloat(Map._size.y)
   Map.setView(Map.layerPointToLatLng(L.point(X, Y-360)));
}

$(function() {
        //$('.leftbox,.rightbox').css('float','left').css('width','50%');
        const MapContainer = $('#map'); 
        createMapView(MapContainer.data('fields'),MapContainer.data('tileprovider'));
});

