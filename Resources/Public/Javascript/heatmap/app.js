
var myHeatMap = function(props) {
	var params = {};
	window.location.search.substr(1).split('&').forEach(function(p){
		const k = p.split('=')[0];
		params[k]=decodeURI(p.split('=')[1]); 	
	});
	const tileprovider = JSON.parse(params.tileprovider);
	const geodata = JSON.parse(params.geodata);
	const link = unescape(params.link);
	var tileLayer;
	if (tileprovider.type=='wms') {
                const endpoint = tileprovider.endpoint + tileprovider.service;
                const tileoptions = {
                        layers : tileprovider.layers,
                        retina : tileprovider.size.replace('@','').replace('x','') || 1,
                        attribution : tileprovider.attribution
                }; 
                tileLayer =  tileprovider.dsvgo || true 
                        ? L.tileLayer.wms( '/?eID=wms&endpoint='+ endpoint, tileoptions)
                        : L.tileLayer.wms(endpoint,tileoptions);
        } 
	
	var heatmapLayer = new HeatmapOverlay({
		"radius" : 0.015,
		"maxOpacity" : .6,
		"scaleRadius" : true,
		"useLocalExtrema" : false,
		"latField" : 'lat',
		"lngField" : 'lng',
		"valueField" : 'value'
	});
	heatmapLayer.setData({
                //max : 44,
                data : geodata
        });
	const bounds = L.latLngBounds(geodata.map(function(p) {
		return new L.latLng([p.lat,p.lng]);
	}));

	const map = new L.Map('map', {
		layers : [tileLayer,heatmapLayer],
		minZoom : tileprovider.minzoom || 7,
		editable : true,
		center : bounds.getCenter(),
		zoom : 12,
		crs : L.CRS[tileprovider.crs.replace(':','')],
		maxZoom: tileprovider.maxzoom || 18,
		touchZoom : false,
		zoomControl : true
	});

	//const RECT = [[53.45494027363383, 9.948120117187502], [53.579053825265085, 10.126647949218752]]; 
	const rect = L.rectangle(bounds.pad(0.15)).addTo(map);
	rect.enableEdit();
	var selectedBounds = bounds;
	rect.bindTooltip('Klick um Geofiltersuche auszulösen.');
	var shades = new L.LeafletShades({bounds: rect.getBounds()});
	shades.addTo(map);
	map.fitBounds(bounds);
	shades.on('shades:bounds-changed', function(event) {
		selectedBounds = event.bounds;
	});
	shades.on('editable:vertex:dragend', function(event) {
		selectedBounds = event.bounds;
	});
	map.on('click', function(event) {
		const filter = '['+selectedBounds._southWest.lat+','+selectedBounds._southWest.lng 
			+ '%20TO%20'
			+ selectedBounds._northEast.lat + ',' + selectedBounds._northEast.lng + ']';
		const geofilter = 'tx_find_find%5Bq%5D%5DgeoLocationPoint%5D=' + filter + '&';	
                const needle = 'tx_find_find%5Bfacet%5D%5Bheatmap%5D%5B%25s%5D=1&';
                console.log(geofilter);
                const currentlink = link.replace(needle,geofilter);
                console.log(currentlink)
 
                top.location=currentlink;
        });
	$(function(){
		//L.control.scalefactor().addTo(map);		
	});
	L.control.betterscale({
		metric:true,
		maxWidth:500,
		imperial:false
	}).addTo(map);
};

$(function() {myHeatMap()});


