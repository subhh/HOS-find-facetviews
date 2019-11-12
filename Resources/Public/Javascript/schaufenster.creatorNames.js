const ORCID_ENABLED = false;

const ORCID = '/typo3conf/ext/hosfindfacetviews/Resources/Public/assets/orcid.png';

const ORCID_ENDPOINT = 'https://orcid.org/';
const M = '👤'; 
if (!OrcidCache) {
  var OrcidCache={};
}
$(function() {
    
    /* Avatar malen */
    $('.field-creatorName_facet,.field-creatorName').each(function() {
        var that = $(this);
        var html = that.html();
    });

    function addOrcidPreview(elem, orcid) {
        var logo = '<img width="240" src="http://www.oaacademy.org/img/orcid-hero-logo.png" /><br/>';
        elem.qtip({
            content: {
                text: function(event, api) {
                    $.ajax({
                            url: '?eID=orcid&action=person&orcid=' + orcid // Use href attribute as URL
                        })
                        .then(function(content) {
                            // Set the tooltip content upon successful retrieval
                            var html = '<table width="100%">';
                            html += '<tr><td>ORCİD:</td><td>' + orcid + '</td></tr>';
                            if (content['last-modified-date']) {
                                var date = new Date(content['last-modified-date'].value).toDateString();
                                html += '<tr><td>letzte Änderung:</td><td>' + date + '</td></tr>';
                            }
                            if (content.name) {
                                if (content.name['given-names'])
                                    html += '<tr><td>Vorname:</td><td>' + content.name['given-names'].value + '</td></tr>';
                                if (content.name['family-name'])
                                    html += '<tr><td>Familienname:</td><td>' + content.name['family-name'].value + '</td></tr>';
                            }
                            if (content['other-names'] && content['other-names']['other-name']) {
                                var othernames = content['other-names']['other-name'].map(function(othername){
                                    console.log(othername.content);
                                    return othername.content;
                                });
                                html += '<tr><td>andere Namen:</td><td>' + othernames.join(', ') + '</td></tr>';
                            }    
                            if (content.emails && content.emails.email && content.emails.email[0] && content.emails.email[0].email)
                                html += '<tr><td>eMail:</td><td>' + content.emails.email[0].email + '</td></tr>';
                            if (content.biography && content.biography.content)
                                html += '<tr><td>Lebenslauf:</td><td>' + content.biography.content + '</td></tr>';
                            html += '</table>';
                            api.set('content.text', logo + html);
                        }, function(xhr, status, error) {
                            // Upon failure... set the tooltip content to error
                            api.set('content.text', status + ': ' + error);
                        });

                    return logo + '<br/><img width="100%" src="/typo3conf/ext/findhosfacetviews/Resources/Public/orcidloader.gif" />'; // Set some initial text
                }
            },
            position: {
                //viewport: $(window)
            },
            style: 'qtip-wiki'
        });

    }
    setTimeout(function() {
        
        function renderOrcids(orcids,that) {
          var html = that.html();
          that.html(M+ html);
          if (orcids.length)
              for (var i = 0; i < orcids.length; i++) {
                  var orcid = orcids[i];
                  that.append(' <a rel="noreferrer" href="'+ ORCID_ENDPOINT + orcid + '" orcid="' + orcid + '" ><img src="https://orcid.org/sites/default/files/images/orcid_16x16(1).gif" /></a>');
                  addOrcidPreview($('[orcid=' + orcid + ']'), orcid);
              }
          else that.html(M+ html);
        }

        // facettes
        $('.facet-id-Author .facetList li').not('.facetShowAll').each(function() {
            return;
            var that = $(this);
            var html = that.html();
            var parts = that.text().trim().match(/^(.*?),\s(.*?)\s([\d]+)/);
            if (ORCID_ENABLED ==true) {
                if (parts) {
                    getOrcid(parts[2],parts[1],that, renderOrcids)
                //      that.html('<li>  <span class="fa fa-male"></span> ' + html + orcidhtml);
                }
            } 
        });
    
   },20); // for accelerating of tile delivering     

   // preloading of cache:
   // getting from cache or from net by eID
   function getOrcid(vname,fname,that,cb) {
     return;
      var key = vname.trim() + ' ' + fname.trim().replace('👤', ''); //
      if (OrcidCache[key]) {
         cb(JSON.parse(OrcidCache[key]),that);
         return;
      } else {
        var url = '?eID=orcid&action=search&vname=' + vname + '&fname=' + fname.replace('👤', '');
        $.getJSON(url, function(res) {
          cb(res,that);
        })
      }
   }
});
