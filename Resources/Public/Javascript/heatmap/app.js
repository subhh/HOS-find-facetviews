
/**
 * Leaflet vector features drag functionality
 * @author Alexander Milevski <info@w8r.name>
 * @preserve
 */
L.Path.include({_transform:function(t){if(this._renderer){if(t){this._renderer.transformPath(this,t)}else{this._renderer._resetTransformPath(this);this._update()}}return this},_onMouseClick:function(t){if(this.dragging&&this.dragging.moved()||this._map.dragging&&this._map.dragging.moved()){return}this._fireMouseEvent(t)}});var END={mousedown:"mouseup",touchstart:"touchend",pointerdown:"touchend",MSPointerDown:"touchend"};var MOVE={mousedown:"mousemove",touchstart:"touchmove",pointerdown:"touchmove",MSPointerDown:"touchmove"};function distance(t,a){var i=t.x-a.x,n=t.y-a.y;return Math.sqrt(i*i+n*n)}L.Handler.PathDrag=L.Handler.extend({statics:{DRAGGING_CLS:"leaflet-path-draggable"},initialize:function(t){this._path=t;this._matrix=null;this._startPoint=null;this._dragStartPoint=null;this._mapDraggingWasEnabled=false},addHooks:function(){this._path.on("mousedown",this._onDragStart,this);this._path.options.className=this._path.options.className?this._path.options.className+" "+L.Handler.PathDrag.DRAGGING_CLS:L.Handler.PathDrag.DRAGGING_CLS;if(this._path._path){L.DomUtil.addClass(this._path._path,L.Handler.PathDrag.DRAGGING_CLS)}},removeHooks:function(){this._path.off("mousedown",this._onDragStart,this);this._path.options.className=this._path.options.className.replace(new RegExp("\\s+"+L.Handler.PathDrag.DRAGGING_CLS),"");if(this._path._path){L.DomUtil.removeClass(this._path._path,L.Handler.PathDrag.DRAGGING_CLS)}},moved:function(){return this._path._dragMoved},_onDragStart:function(t){var a=t.originalEvent._simulated?"touchstart":t.originalEvent.type;this._mapDraggingWasEnabled=false;this._startPoint=t.containerPoint.clone();this._dragStartPoint=t.containerPoint.clone();this._matrix=[1,0,0,1,0,0];L.DomEvent.stop(t.originalEvent);L.DomUtil.addClass(this._path._renderer._container,"leaflet-interactive");L.DomEvent.on(document,MOVE[a],this._onDrag,this).on(document,END[a],this._onDragEnd,this);if(this._path._map.dragging.enabled()){this._path._map.dragging.disable();this._mapDraggingWasEnabled=true}this._path._dragMoved=false;if(this._path._popup){this._path._popup._close()}this._replaceCoordGetters(t)},_onDrag:function(t){L.DomEvent.stop(t);var a=t.touches&&t.touches.length>=1?t.touches[0]:t;var i=this._path._map.mouseEventToContainerPoint(a);if(t.type==="touchmove"&&!this._path._dragMoved){var n=this._dragStartPoint.distanceTo(i);if(n<=this._path._map.options.tapTolerance){return}}var e=i.x;var r=i.y;var s=e-this._startPoint.x;var o=r-this._startPoint.y;if(s||o){if(!this._path._dragMoved){this._path._dragMoved=true;this._path.fire("dragstart",t);this._path.bringToFront()}this._matrix[4]+=s;this._matrix[5]+=o;this._startPoint.x=e;this._startPoint.y=r;this._path.fire("predrag",t);this._path._transform(this._matrix);this._path.fire("drag",t)}},_onDragEnd:function(t){var a=this._path._map.mouseEventToContainerPoint(t);var i=this.moved();if(i){this._transformPoints(this._matrix);this._path._updatePath();this._path._project();this._path._transform(null);L.DomEvent.stop(t)}L.DomEvent.off(document,"mousemove touchmove",this._onDrag,this);L.DomEvent.off(document,"mouseup touchend",this._onDragEnd,this);this._restoreCoordGetters();if(i){this._path.fire("dragend",{distance:distance(this._dragStartPoint,a)});var n=this._path._containsPoint;this._path._containsPoint=L.Util.falseFn;L.Util.requestAnimFrame(function(){L.DomEvent.skipped({type:"click"});this._path._containsPoint=n},this)}this._matrix=null;this._startPoint=null;this._dragStartPoint=null;this._path._dragMoved=false;if(this._mapDraggingWasEnabled){if(i)L.DomEvent.fakeStop({type:"click"});this._path._map.dragging.enable()}},_transformPoints:function(t,a){var i=this._path;var n,e,r;var s=L.point(t[4],t[5]);var o=i._map.options.crs;var h=o.transformation;var _=o.scale(i._map.getZoom());var g=o.projection;var d=h.untransform(s,_).subtract(h.untransform(L.point(0,0),_));var p=!a;i._bounds=new L.LatLngBounds;if(i._point){a=g.unproject(g.project(i._latlng)._add(d));if(p){i._latlng=a;i._point._add(s)}}else if(i._rings||i._parts){var l=i._rings||i._parts;var f=i._latlngs;a=a||f;if(!L.Util.isArray(f[0])){f=[f];a=[a]}for(n=0,e=l.length;n<e;n++){a[n]=a[n]||[];for(var u=0,c=l[n].length;u<c;u++){r=f[n][u];a[n][u]=g.unproject(g.project(r)._add(d));if(p){i._bounds.extend(f[n][u]);l[n][u]._add(s)}}}}return a},_replaceCoordGetters:function(){if(this._path.getLatLng){this._path.getLatLng_=this._path.getLatLng;this._path.getLatLng=L.Util.bind(function(){return this.dragging._transformPoints(this.dragging._matrix,{})},this._path)}else if(this._path.getLatLngs){this._path.getLatLngs_=this._path.getLatLngs;this._path.getLatLngs=L.Util.bind(function(){return this.dragging._transformPoints(this.dragging._matrix,[])},this._path)}},_restoreCoordGetters:function(){if(this._path.getLatLng_){this._path.getLatLng=this._path.getLatLng_;delete this._path.getLatLng_}else if(this._path.getLatLngs_){this._path.getLatLngs=this._path.getLatLngs_;delete this._path.getLatLngs_}}});L.Handler.PathDrag.makeDraggable=function(t){t.dragging=new L.Handler.PathDrag(t);return t};L.Path.prototype.makeDraggable=function(){return L.Handler.PathDrag.makeDraggable(this)};L.Path.addInitHook(function(){if(this.options.draggable){this.options.interactive=true;if(this.dragging){this.dragging.enable()}else{L.Handler.PathDrag.makeDraggable(this);this.dragging.enable()}}else if(this.dragging){this.dragging.disable()}});L.SVG.include({_resetTransformPath:function(t){t._path.setAttributeNS(null,"transform","")},transformPath:function(t,a){t._path.setAttributeNS(null,"transform","matrix("+a.join(" ")+")")}});L.SVG.include(!L.Browser.vml?{}:{_resetTransformPath:function(t){if(t._skew){t._skew.on=false;t._path.removeChild(t._skew);t._skew=null}},transformPath:function(t,a){var i=t._skew;if(!i){i=L.SVG.create("skew");t._path.appendChild(i);i.style.behavior="url(#default#VML)";t._skew=i}var n=a[0].toFixed(8)+" "+a[1].toFixed(8)+" "+a[2].toFixed(8)+" "+a[3].toFixed(8)+" 0 0";var e=Math.floor(a[4]).toFixed()+", "+Math.floor(a[5]).toFixed()+"";var r=this._path.style;var s=parseFloat(r.left);var o=parseFloat(r.top);var h=parseFloat(r.width);var _=parseFloat(r.height);if(isNaN(s))s=0;if(isNaN(o))o=0;if(isNaN(h)||!h)h=1;if(isNaN(_)||!_)_=1;var g=(-s/h-.5).toFixed(8)+" "+(-o/_-.5).toFixed(8);i.on="f";i.matrix=n;i.origin=g;i.offset=e;i.on=true}});function TRUE_FN(){return true}L.Canvas.include({_resetTransformPath:function(t){if(!this._containerCopy)return;delete this._containerCopy;if(t._containsPoint_){t._containsPoint=t._containsPoint_;delete t._containsPoint_;this._requestRedraw(t)}},transformPath:function(t,a){var i=this._containerCopy;var n=this._ctx,e;var r=L.Browser.retina?2:1;var s=this._bounds;var o=s.getSize();var h=s.min;if(!i){i=this._containerCopy=document.createElement("canvas");e=i.getContext("2d");i.width=r*o.x;i.height=r*o.y;this._removePath(t);this._redraw();e.translate(r*s.min.x,r*s.min.y);e.drawImage(this._container,0,0);this._initPath(t);t._containsPoint_=t._containsPoint;t._containsPoint=TRUE_FN}n.save();n.clearRect(h.x,h.y,o.x*r,o.y*r);n.setTransform(1,0,0,1,0,0);n.restore();n.save();n.drawImage(this._containerCopy,0,0,o.x,o.y);n.transform.apply(n,a);this._drawing=true;t._updatePath();this._drawing=false;n.restore()}});


var myHeatMap = function(props) {
	var params = {};
	window.location.search.substr(1).split('&').forEach(function(p){
		const k = p.split('=')[0];
		params[k]=decodeURI(p.split('=')[1]); 	
	});
	const tileprovider = JSON.parse(params.tileprovider);
	const geodata = JSON.parse(params.geodata);
	var nearestPoint= {lat:53.5665673,lng:9.9824308};
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
        } else {
        }
	
	var heatmapLayer = new HeatmapOverlay({
		"radius" : 0.004,
		"maxOpacity" : .7,
		"scaleRadius" : true,
		"useLocalExtrema" : false,
		"latField" : 'lat',
		"lngField" : 'lng',
		"valueField" : 'value'
	});
	heatmapLayer.setData({
                max : 4,
                data : geodata
        });
	const bounds = L.latLngBounds(geodata.map(function(p) {
		return new L.latLng([p.lat,p.lng]);
	}));
	var map = new L.Map('map', {
		layers : [tileLayer,heatmapLayer],
		minZoom : tileprovider.minzoom || 7,
		center : nearestPoint,
		zoom : 12,
		crs : L.CRS[tileprovider.crs.replace(':','')],
		maxZoom: tileprovider.maxzoom || 18,
		touchZoom : false,
		zoomControl : true
	});
	var circle = L.circle(nearestPoint,{
			weight:0.5,
			clickable:true,
			radius: 600,
			fillOpacity:.3,
			draggable:true
		}).addTo(map);
	circle.dragging.enable();
	var tooltipp = circle.bindTooltip("Der blaue Ring kann bewegt werden.<br/>Klick darauf startet gefilterte Suche.");
	tooltipp.openTooltip();
	circle.on('dragstart',function(){
		tooltipp.closeTooltip();	
	});
	circle.on('dragend',function(){
			var count =0;
		    	// looking for nearest point:
		    	geodata.forEach(function(item) {
				item.dist = map.distance({
					lat : item.lat,
					lng : item.lng
					}, circle.getLatLng());
			});
			geodata.sort(function(a, b) {
				return a.dist > b.dist;
			});
			nearestPoint = {
				lat : geodata[0].lat,
				lng : geodata[0].lng
			};
			circle.setLatLng(nearestPoint);
			tooltipp.openTooltip();
			tooltipp.setTooltipContent(geodata[0].count +' Dokumente von diesem Standort');
			
	});
	circle.on('click',function(){
		const link = "/suche/?tx_find_find%5Bfacet%5D%5BGeolocation%5D%5B###NEEDLE###%5D=1&tx_find_find%5Bcontroller%5D=Search#tx_find";
		top.location= link.replace('###NEEDLE###',nearestPoint.lat+ ','+nearestPoint.lng);
	});		
	map.fitBounds(bounds);
	map.zoomIn();
	$(function(){
		L.control.scalefactor().addTo(map);		
	});
	L.control.betterscale({
		metric:true,
		maxWidth:500,
		imperial:false
	}).addTo(map);
};

$(function() {myHeatMap()});


