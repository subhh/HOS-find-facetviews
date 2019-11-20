const ORCID_ENABLED = false;

const ASSETS = '/typo3conf/ext/hosfindfacetviews/Resources/Public/assets/';

const ORCID_ENDPOINT = 'https://orcid.org/';

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
        var logo = '<img width="240" src="'+ ASSETS + 'orcid-hero-logo.png" /><br/>';
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
                                    return othername.content;
                                });
                              //  html += '<tr><td>andere Namen:</td><td>' + othernames.join(', ') + '</td></tr>';
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

                    return logo + '<br/><img width="20%" src="' + ASSETS + 'orcidloader.gif" />'; // Set some initial text
                }
            },
            position: {
                //viewport: $(window)
            },
            style: 'qtip-dark'
        });

    }
    function addExternalLinks(elem,orcid) {
         $.ajax({url: '?eID=orcid&action=person&orcid=' + orcid }).then(function(content) {
                const researcherUrls = content['researcher-urls'];
                researcherUrls && Array.isArray(researcherUrls['researcher-url']) && researcherUrls['researcher-url'].forEach(function(u){
                       if (u.visibility == "PUBLIC") {
                           const name = u['url-name'];
                           [
                               {regex:/gitlab/i,img:'gitlab.png',title:'GitLab'},
                               {regex:/github/i,img:'github.png',title:'GitHub'},
                               {regex:/twitter/i,img:'twitter.png',title:'Twitter'},
                               {regex:/mastodon/i,img:'mastadon.png',title:'Mastodon'},
                               {regex:/mendeley/i,img:'mendeley.png',title:'Mendeley'},
                               {regex:/homepage/i,img:'homepage.png',title:'Homepage'},
                               {regex:/facebook/i,img:'facebook.png',title:'Facebook'},
                           ].forEach(function(item) {
                               if (name.match(item.regex)) {
                                   const id = (''+Math.random()).replace('0.','экстернlink_');
                                   const imageurl = '?eID=thumbnail&site='+ encodeURIComponent(u.url.value); 
                                   elem.parent().append('<a href="'+u.url.value+'" rel="noreferrer"><img id="'+id+'"style="margin-right:2px" width=16 src="'+ASSETS+ '/' + item.img + '" /></a>')
                                   const text = '<b>Externer Link zu '+item.title+ '</b><br/><br/>'+u.url.value+ '<br/><img src="http://ajaxload.info/cache/FF/FF/FF/63/DA/35/36-1.gif" width="100%" height=120 border=0 /><br/><small><i>Dieser externe Link wurde [Dvon ORCID bereitgestellt.</i></small>';
                                   $('#'+id).qtip({
                                      content: {
                                         text:function(event,api){
                                            $.ajax({ url: imageurl }).done(function(img) {
                                               const txt = text.replace('http://ajaxload.info/cache/FF/FF/FF/63/DA/35/36-1.gif',img);
                                               api.set('content.text',txt)
                                            });
                                            return 'Loading …';
                                         }
                                       },
                                       style : {classes:'qtip-dark'}
                                   });
                                   
               
                      
                               }     
                           });
                       }     
                });
                        
            });

    
    }
    
    $('.orcidlink').each(function() {
            var that = $(this);
            const orcid =  that.attr('href').replace(ORCID_ENDPOINT,'');
            if (that.hasClass('preview')) addOrcidPreview(that, orcid);
            if (that.hasClass("externallinks")) addExternalLinks(that,orcid);
        });
    }
);