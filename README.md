# New facet types for typo3-find extension of subugoe

## Basic architecture

These extensions offer new facets views for [typo3-find extension](https://github.com/subugoe/typo3-find). 

## Example implementation

On [HamburgOpenScience](https://openscience.hamburg.de/) you can see an example implementation.

## Common usage
### Installing extension
You can install via extension manager or with composer.

![](https://i.imgur.com/O31C4M7.png)


## List of facets

### Heatmap vie

Example rendering:

![](https://i.imgur.com/RH0oepr.png)

#### Typoscript:

First add static template from extension:
![](https://i.imgur.com/vKF2wcs.png)

Now you can add new type inside `plugin.tx_find.settings` section of typoscript: 
```
plugin.tx_find.settings.facets.heatmap {
   type = Heatmap
   fetchMaximum = 1000
   field = geoLocationPoint 
   tileProvider = https://stamen-tiles-c.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}@2x.png
   dsvgo = 1
   attribution = Map tiles by <a title="Design by Stamen Design" href="https://stamen.com/maps/">Stamen Design</a>, CC BY 3.0
```
#### Other maps types

On [this page](https://leaflet-extras.github.io/leaflet-providers/preview/) you can choose an other map provider.

#### General Data Protection Regulation (EU-DSVGO)
If you want avoid access of not local web servers you can use the embedded tile cache. Additional the class caches the tiles. This avoid to much traffic of native tile provider. Attention: maybe it is a good idea to limit the range.

### Switch view

![](https://i.imgur.com/nZOk1ft.png)

#### Typescript configuration:

For configuration add these properties below to the section:
```
plugin.tx_find.settings.facets.10 {
       id = OpenAccess
       headerhidden = 1
       field = rightsOA
       type = Threestateswitch
       displayDefault = 2
       link = ?tx_find_find[facet][OpenAccess][%s]=1&tx_find_find[controller]=Search
       csspath= typo3conf/ext/discovery/Resources/Public/CSS/toggle-switch.css
       toast = Publikationen vom Typ: „%s“
       query=(rightsOA:%s)
       values {
              Open=Open Access
              All=Open Access,zugriffsbeschränkt
              Close=zugriffsbeschränkt
       }
       labels {
              Open=Open Access
              All=Alle Dokumente
              Close=Restricted Access 
       }
}
```
### Pie view

![](https://i.imgur.com/vejQE2M.png)

### Wordcloud view

![](https://i.imgur.com/g2FVhXE.png)

### DDC view
![](https://i.imgur.com/7yyQNYf.png)
