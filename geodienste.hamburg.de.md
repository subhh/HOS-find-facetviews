# Usage of geodienste.hamburg.de for map rendering

The "Landesbetriebe für Geoinformation und Vermessung" offers a couple of tile services for [rendering of maps](https://geoportal-hamburg.de/Geoportal/geo-online/?mdid=2AE6D23E-48A5-4D85-BC0A-160737E0C8D2). This HOWTO shows the possibilites. There is a [live demo](https://geoportal-hamburg.de/Geoportal/geo-online/).
 
## Sample usage

### leaflet

```javascript
 const tileoptions = {
     layers : 'ALKIS_Basiskarte_farbig',
     attribution : 'Freie und Hansestadt Hamburg, Landesbetrieb Geoinformation und Vermessung'
 },
   tileLayer = L.tileLayer.wms('https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan',tileoptions),
   mapoptions = {
      crs : L.CRS['EPSG4326'],
      layers : [tileLayer],
      maxZoom: 15,
      minZoom : 9
 };
 L.map(id,mapoptions).setView(53.53,10.01, 12);
```

### mapbox

```javascript
```
![](https://i.imgur.com/Tt92dkC.jpg)

## Potential pitfall
The map will rendered by client in a grid of 256×256 pixel. If you request in same format then in some cases the quality don't satisfied your requests. In this case you can requests larger tiles, i.e. 512×512.  


|         |            | |
| ------------- |-------------|
| 256x256      | 360x360 | 512x512 |
| <img src="https://geodienste.hamburg.de/HH_WMS_DISK60?service=WMS&request=GetMap&layers=1&styles=&format=image/jpeg&transparent=false&version=1.1.1&retina=1.5&width=256&height=256&srs=EPSG:3857&bbox=1110477.1469270408,7088464.255054105,1115369.1167372921,7093356.224864355" width=256 height=256 />      |  <img src="https://geodienste.hamburg.de/HH_WMS_DISK60?service=WMS&request=GetMap&layers=1&styles=&format=image/jpeg&transparent=false&version=1.1.1&retina=1.5&width=360&height=360&srs=EPSG:3857&bbox=1110477.1469270408,7088464.255054105,1115369.1167372921,7093356.224864355" width=256 height=256 />    |<img src="https://geodienste.hamburg.de/HH_WMS_DISK60?service=WMS&request=GetMap&layers=1&styles=&format=image/jpeg&transparent=false&version=1.1.1&retina=1.5&width=512&height=512&srs=EPSG:3857&bbox=1110477.1469270408,7088464.255054105,1115369.1167372921,7093356.224864355" width=256 height=256 />


## Endpoints

Inside the [Transparenzportal of Hamburg](http://transparenz.hamburg.de/) you can find pointer to the WFS service. The WFS service shows all available data. Here a copy of this list:

* https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?REQUEST=GetCapabilities&SERVICE=WMS 
* https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte_GB?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_Schriftplatte?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_Geobasisdaten?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_Kombi_DISK_GB?REQUEST=GetCapabilities&SERVICE=WMS 
* https://geodienste.hamburg.de/HH_WMS_Geobasisdaten_SG?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_Geobasisdaten_SW?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_DOP20?REQUEST=GetCapabilities&SERVICE=WMS 
* https://geodienste.hamburg.de/HH_WMS_DOP20_belaubt?REQUEST=GetCapabilities&SERVICE=WMS
* https://geodienste.hamburg.de/HH_WMS_Cache_Luftbilder?REQUEST=GetCapabilities&SERVICE=WMS 
* https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan?REQUEST=GetCapabilities&SERVICE=WMS 

Every WFS contains the available layers and other details. In the end the client requests a tile with this syntax:

https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan?service=WMS&request=GetMap&layers=ALKIS_Basiskarte_farbig&styles=&format=image/png&transparent=false&version=1.1.1&width=256&height=256&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875

Obviously the client (leaflet, mapbox) adds the parameter `bbox` automatically depending on needed tile triggered by user events.

## Layers

For addressing a layer you need the endpoint above and the layer and the crs (projection).

### HH_WMS_ALKIS_Basiskarte
* 0

![](https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?service=WMS&request=GetMap&layers=0&styles=&format=image/png&transparent=false&version=1.1.1&width=128&height=128&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)

* 1
![](https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?service=WMS&request=GetMap&layers=1&styles=&format=image/png&transparent=false&version=1.1.1&width=128&height=128&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)
* 2
![](https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?service=WMS&request=GetMap&layers=2&styles=&format=image/png&transparent=false&version=1.1.1&width=128&height=128&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)
* 3
![](https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?service=WMS&request=GetMap&layers=3&styles=&format=image/png&transparent=false&version=1.1.1&width=128&height=128&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)
...
* 32

![](https://geodienste.hamburg.de/HH_WMS_ALKIS_Basiskarte?service=WMS&request=GetMap&layers=32&styles=&format=image/png&transparent=false&version=1.1.1&width=128&height=128&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)


### HH_WMS_ALKIS_Basiskarte_GB
### HH_WMS_Schriftplatte
### HH_WMS_Geobasisdaten
### HH_WMS_Kombi_DISK_GB 
### HH_WMS_Geobasisdaten_SG
### HH_WMS_Geobasisdaten_SW
### HH_WMS_DOP20 
### HH_WMS_DOP20_belaubt
### HH_WMS_Cache_Luftbilder 
### HH_WMS_Cache_Stadtplan
* ALKIS_Basiskarte_farbig

![](https://geodienste.hamburg.de/HH_WMS_Cache_Stadtplan?service=WMS&request=GetMap&layers=ALKIS_Basiskarte_farbig&styles=&format=image/png&transparent=false&version=1.1.1&width=256&height=256&srs=EPSG:4326&bbox=9.9591064453125,53.580322265625,9.964599609375,53.5858154296875)
