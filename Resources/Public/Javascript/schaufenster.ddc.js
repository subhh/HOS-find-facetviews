String.prototype.trunc = String.prototype.trunc ||
    function(n) {
        return (this.length > n) ? this.substr(0, n - 1) + '…' : this;
    };

function getPreselectedDDC() {
    var REGEX = /tx_find_find\[facet\]\[Fachgebiet\]\[(.*?)\]/;
    var res = null;
    var href = window.location.href.replace(/#.*/, '');
    var hashes = href.slice(href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        var key = hash[0];
        var match = key.match(REGEX);
        if (match && hash[1] != "") {
            res = match[1];
        }
    }
    return res;
}

$(function() {
    /* Fancifizierung der DDC */
    var facets = {};
    var preselectedDDC = getPreselectedDDC();
    // Collecting all DDC:
    $('.DDCContainer').each(function() {
        var that = $(this);
        const ddcdata = JSON.parse(that.attr('data-ddcdata'));
        Object.keys(ddcdata).forEach(function(ddc){
            if (!ddc) return;
            ddc = ddc.replace(/\./, '').substring(0, 3);
            // Collecting all (creating and/or adding)
            if (!facets[ddc]) facets[ddc] = parseInt(that.attr('count'));
            else facets[ddc] += parseInt(count);
        });
        that.append('<div id="ddctree" style="width:100%;"/>');
        // Converting ddc-array to tree:
        var data = FacetsToTree(ddc_de, facets, preselectedDDC);

        // rendering raw tree
        $('#ddctree').on('select_node.jstree', function(node, selected, event) {
            self.location = selected.node['a_attr'].href;

    }).jstree({
        core: {
            "themes": {
                "icons": false
            },
            data: data
        }
    });
});    
});



function FacetsToTree(DDC, facets, preselectedDDC) {
    var DDC_LINK = '?tx_find_find[facet][Fachgebiet][###NEEDLE###]=1&tx_find_find[controller]=Search';
    var data = [];

    function createHTML(ddc, limit) {
        if (!facets[ddc])
            return ddc_de[ddc].trunc(limit);
        const fett  = (preselectedDDC==ddc) ? 'style="font-weight:bold"':'';
        return '<a '+fett+' href="' +
            DDC_LINK.replace('###NEEDLE###', ddc) +
            '" title="' +
            ddc_de[ddc] +
            '">' +
            ddc_de[ddc].trunc(limit) +
            '</a> <span class="facetCount">' +
            facets[ddc] +
            '</span>';
    };
    Object.keys(facets).forEach(function(code) {
        if (!code.match(/\d\d\d/)) return null;
        var level1 = code2tree(code).level1;
        var level2 = code2tree(code).level2;
        var level3 = code2tree(code).level3;
        var level1Node = getNodeByName(data, level1);
        if (!level1Node) {
            // top level 1x
            data.push({
                a_attr: {
                    href: DDC_LINK.replace('###NEEDLE###', level1),
                    onclick: function() {
                        $.toast({
                            message: "Suche gestartet"
                        });
                    }
                },
                name: level1,
                text: createHTML(level1, 28),
                children: [],
                state: {
                    opened: preselectedDDC != null ? true : false // is the node open
                }
            });
            level1Node = getNodeByName(data, level1);
        }
        if (!level2) return;
        var level2Node = getNodeByName(level1Node.children, level2);
        if (!level2Node) {
            level1Node.children.push({
                a_attr: {
                    href: DDC_LINK.replace('###NEEDLE###', level2)
                },
                name: level2,
                text: createHTML(level2, 26),
                children: [],
                state: {
                    opened: preselectedDDC != null ? true : false // is the node open
                }
            });
            level2Node = getNodeByName(level1Node.children, level2);
        }

        if (level3) {
            level2Node.children.push({
                a_attr: {
                    href: DDC_LINK.replace('###NEEDLE###', level3)
                },
                name: level3,
                text: createHTML(level3, 23)
            });
        }
    });

    function code2tree(code) {
        return {
            code: code,
            level1: code.substring(0, 1) + '00',
            level2: (code.substring(1, 3) != '00') ? code.substring(0, 2) + '0' : undefined,
            level3: (code.substring(2, 3) != '0') ? code : undefined
        }
    }

    function getNodeByName(children, name) {
        var node = null;
        var res = children.forEach(function(n) {
            if (n.name == name) node = n;
        });
        return node;
    }
    return data;
}
