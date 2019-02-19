$(function() {
        var id = 'leafletmapfordetailpage';
        $('article.detail').css('float','left').css('width','50%');
        
        var mapView = $('<div style="height:800px;margin:10px" id="'+id+'"></div><div></div>');
        return;
        $('article').parent().append(mapView);
        const tileprovider = JSON.parse($('#detailmap').attr('data-tileprovider'));
        const fields  = JSON.parse($('#detailmap').attr('data-fields'));       
        
        createMapView(fields,tileprovider,id);
});

function createMapView(fields,tileprovider,id) {
  console.log(fields);
  /* creating map */
  const latlng = fields.geoLocationPoint.split(',');
  var map = L.map(id).setView(latlng, 15);
  L.tileLayer('?eID=tile&url=https://stamen-tiles-c.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);
  var creators = fields['creatorName_facet'];
  var preview = "";
  var icon;
  var logoUrl;
  $('.dd-collection .field-collection a').each(function(){
    const collection = Collections[$(this).attr('oldtitle')];
    icon = '/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/' +collection + '.png';
    logoUrl= '/typo3conf/ext/hosfindfacetviews/Resources/Public/CSS/' +collection + '_big.png';
  });
  var Marker = L.icon({
       iconUrl: icon,
       popupAnchor:  [0, -20],
       iconSize:     [40, 40],
  });
  const logo = '<img style="margin:0 0 50 0" src="'+ logoUrl+ '" width="300" /><br/><br/>';
  $('.field-title').each(function() {
    var popupContent = logo + creators.join(', ') + '<hr/>' + $(this).text() + '<br/><img width="220" height="220" id="previewScreen"/>';
       L.marker(latlng, {
           icon: Marker
      }).addTo(map).bindPopup(popupContent).openPopup();
  });
  // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {

    };

    info.addTo(map);
    info.getContainer().addEventListener('mouseover', function () {
          map.dragging.disable();
      });

      // Re-enable dragging when user's cursor leaves the element
      info.getContainer().addEventListener('mouseout', function () {
          map.dragging.enable();
      });
}