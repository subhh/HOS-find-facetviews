
function myHeatMap(props) {
	var smallTiles = L.tileLayer(props.tileProvider, {
		attribution : props.attribution
	});
	var largeTiles = props.dsvgo 
		? L.tileLayer( '/?eID=tile&url='+ props.tileProvider)
		: L.tileLayer(props.tileProvider);
	const bigMap = props.circle ? true : false;
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
	var tileLayer = props.layer || largeTiles;
	container.css("width", props.width);
	container.css("height", props.height || 90);
	var heatmapLayer = new HeatmapOverlay({
		"radius" : 0.006,
		"maxOpacity" : .8,
		"scaleRadius" : true,
		"useLocalExtrema" : false,
		"latField" : 'lat',
		"lngField" : 'lng',
		"valueField" : 'count'
	});
	var bounds = L.latLngBounds(heatmapdata.map(function(p) {
		return new L.latLng(p.lat, p.lng);
	}));
	var map = new L.Map(props.container, {
		layers : [tileLayer, heatmapLayer],
		maxZoom : 13,
		minZoom : 7,
		dragging : true,
		touchZoom : false,
		zoomControl : props.zoomControl
	});
	map.fitBounds(bounds);
	heatmapLayer.setData({
		max : 4,
		data : heatmapdata
	});

	return map;
};

$(function(){
	$('.heatmapContainer').each(function() {
		var that = $(this);
		var bigMap;
		const facetData = JSON.parse(that.attr('data-facetdata'));
                var smallMap = myHeatMap({
                	container : this,
                	facetData : facetData,
                	dsvgo : that.attr('data-dsvgo'),
                	tileProvider : that.attr('data-tileprovider'),
                	attribution : that.attr('data-attribution')
                });
                smallMap.on('click', function(e) {
                        var height = $(window).height() * 0.75;
                        var width = $(window).width() * 0.65;
                        const querystring = encodeURI('attribution='+encodeURI(that.attr('data-attribution')) +'&dsvg=' + that.attr('data-dsvgo') + '&url=' + that.attr('data-tileprovider') + '&data='+JSON.stringify(facetData));
                        $.fancybox.open({
                                type : 'iframe',
                                src : '/typo3conf/ext/hosfindfacetviews/Resources/Public/Javascript/heatmap/?'+querystring,
                                touch : false,
                                opts : {
                                        touch : false,
                                        width : width,
                                        height : height,
                                        overlayColor : '#200',
                                        scrolling : false,
                                        showCloseButton : true,
                                }
                        });
                });

		
	});

});
