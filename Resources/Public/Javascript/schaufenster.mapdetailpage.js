function createMapView(fields,tileprovider) {
  /* creating map */
  if (!fields) return;
  const latlng = fields.internal_geoLocation_facet.split(',');
  const endpoint = tileprovider.endpoint + tileprovider.service;
  const tileLayer =  L.tileLayer.wms( '/?eID=wms&endpoint='+ endpoint, {
        layers : tileprovider.layers,
        retina : tileprovider.size.replace('@','').replace('x','') || 1,
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
       iconSize:     [48, 48],
  });
   
   const logo = '<img src="'+ ASSETS + encodeURI(fields.internal_institution_id) + '_big.png" alt=""/>';
   const popupContent = logo +'<p><i>'+fields.creatorName.join(', ')+'</i></p><p><hb>' +fields.title.join(', ')+'</b></p>';
   L.marker(fields.internal_geoLocation_facet.split(','), {
          icon: Marker
      }).addTo(Map).bindPopup(popupContent).openPopup();
   const X =  parseFloat(Map._size.x)/2;
   const Y = parseFloat(Map._size.y)
   Map.setView(Map.layerPointToLatLng(L.point(X, Y-360)));
}

$(function() {
        //$('.leftbox,.rightbox').css('float','left').css('width','50%');
        const MapContainer = $('#map'); 
        createMapView(MapContainer.data('fields'),MapContainer.data('tileprovider'));
});

