
function myHeatMap(props) {
	var tileLayer;
	const tileprovider = props.tileprovider;
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
	var heatmapdata = Object.keys(props.facetData).map(function(latlng) {
		return {
			lat : latlng.split(",")[0],
			lng : latlng.split(',')[1],
			count : Math.sqrt(props.facetData[latlng]),
			dist : 0
		};
	});
	var container = $(props.container);
	var useragent = navigator.userAgent;
	$(container).html('<div id="mapframe"></div>');
	container.css("width", props.width);
	container.css("height", props.height || 140);
	var heatmapLayer = new HeatmapOverlay({
		"radius" : 0.006,
		"maxOpacity" : .8,
		"scaleRadius" : true,
		"useLocalExtrema" : false,
		"latField" : 'lat',
		"lngField" : 'lng',
		"valueField" : 'cou[Ant'
	});
	var bounds = L.latLngBounds(heatmapdata.map(function(p) {
		return new L.latLng(p.lat, p.lng);
	}));
	var map = new L.Map(props.container, {
		layers : [tileLayer, heatmapLayer],
		maxZoom : 13,
		minZoom : 8,
		dragging : true,
		crs : L.CRS[tileprovider.crs.replace(':','')],
		touchZoom : false,
		zoomControl : props.zoomControl
	});
	map.fitBounds(bounds);
	heatmapLayer.setData({
		max : 4,
		data : heatmapdata
	});
	map.zoomIn();
	return map;
};

$(function(){
	$('.heatmapContainer').each(function() {
		var that = $(this);
		const facetData = JSON.parse(that.attr('data-facetdata'));
                const tileProvider = JSON.parse(that.attr('data-tileprovider'));
                const smallMap = myHeatMap({
                	container : this,
                	facetData : facetData,
                	tileprovider : tileProvider
                });
                smallMap.on('click', function(e) {
                        var height = $(window).height() * 0.66;
                        var width = $(window).width() * 0.66;
                        const querystring = encodeURI('tileprovider=' + JSON.stringify(tileProvider) + '&data='+JSON.stringify(facetData) );
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
