# Usage of geodienste.hamburg.de for map rendering

The "Landesbetriebe für Geoinformation und Vermessung" offers a couple of tile services for [rendering of maps](https://geoportal-hamburg.de/Geoportal/geo-online/?mdid=2AE6D23E-48A5-4D85-BC0A-160737E0C8D2). This HOWTO shows the possibilites. There is a [live demo](https://geoportal-hamburg.de/Geoportal/geo-online/).
 
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


