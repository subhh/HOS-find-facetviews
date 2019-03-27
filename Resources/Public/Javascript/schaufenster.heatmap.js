function cleanFacetDataGeolocation(foo) {
 const list = Object.keys(foo).map(function(latlng){
 	return {
 		key : latlng,
 		count:foo[latlng]
 		};
 });
 const latlng  = list.filter(function(item){
 	return (item.key.split(',')==null) ? false:true
 }).filter(function(item){
 	const lat = item.key.split(',')[0];
 	const lng = item.key.split(',')[1];
 	return (!isNaN(parseFloat(lat)) && !isNaN(parseFloat(lng))) ? true : false;

 });
 return latlng.map(function(item){
	return {	lat : item.key.split(",")[0],
		lng : item.key.split(',')[1],
		value : Math.round(Math.sqrt(item.count)),
		count : item.count
	};
    });	
}


function myHeatMap(props) {
	var tileLayer;
	const tileprovider = props.tileprovider;
	if (tileprovider.type=='wms') {
	        const endpoint = tileprovider.endpoint + tileprovider.service;
	        const tileoptions = {
	        	layers : tileprovider.layers,
	        	retina : tileprovider.size.replace('@','').replace('x','') || 1,
	        	attribution : ''//props.tileprovider.attribution
	        }; 
		tileLayer = tileprovider.dsvgo || true 
			? L.tileLayer.wms( '/?eID=wms&endpoint='+ endpoint, tileoptions)
			: L.tileLayer.wms(endpoint,tileoptions);
	} else {
	}
		
	var heatmapdata = props.geodata;
	var container = $(props.container);
	var useragent = navigator.userAgent;
	$(container).html('<div id="mapframe"></div>');
	container.css("width", props.width);
	container.css("height", props.height || 220);
	var heatmapLayer = new HeatmapOverlay({
		"radius" : 0.006,
		"maxOpacity" : .8,
		"scaleRadius" : true,
		"useLocalExtrema" : false,
		"latField" : 'lat',
		"lngField" : 'lng',
		"valueField" : 'cou[Ant'
	});
	const bounds = L.latLngBounds(heatmapdata.map(function(p) {
		return new L.latLng(p.lat, p.lng);
	}));
	var map = new L.Map(props.container, {
		layers : [tileLayer, heatmapLayer],
		dragging : true,
		zoom : 11,
		maxZoom:11,
		minZoom:11,
		center : {lat:53.5665673,lng:9.9824308},
		crs : L.CRS[tileprovider.crs.replace(':','')],
		touchZoom : false,
		zoomControl : props.zoomControl
	});
//	map.fitBounds(bounds);
	heatmapLayer.setData({
		max : 4,
		data : heatmapdata
	});
//	map.zoomIn();
	return map;
};

$(function() {
	$('.heatmapContainer').each(function() {
		var that = $(this);
		const geodata = cleanFacetDataGeolocation(JSON.parse(that.attr('data-facetdata')));
                const tileProvider = JSON.parse(that.attr('data-tileprovider'));
                const smallMap = myHeatMap({
                	container : this,
                	geodata : geodata,
                	tileprovider : tileProvider
                });
                
                smallMap.on('click', function(e) {
                        var height = $(window).height() * 0.66;
                        var width = $(window).width() * 0.66;
                        const querystring = encodeURI('tileprovider=' + JSON.stringify(tileProvider) + '&geodata='+JSON.stringify(geodata) );
                // http://fancyapps.com/fancybox/3/docs/#iframe
                        $.fancybox.open({
                                type : 'iframe',
                                src : '/typo3conf/ext/hosfindfacetviews/Resources/Public/Javascript/heatmap/?'+querystring,
                                        touch : false,
                                        autoscale:true,
                                        width : width,
                                        height : height,
                                        scrolling : false,
                                        showCloseButton : true,
                        });
                });

		
	});

});
