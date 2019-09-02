$(function() {
    $('.PieContainer').each(function() {
        const that = $(this);
        /* Import of parameters from fluid */
        const maxValues  = that.data('maxvalues') || 12;
        /* all facets*/
        const facetdata = that.data('facetdata');
        /* only active facets */
        const activefacets = that.data('activefacets');
        /* name of facet, in our case 'publisher' */
        const facetid = that.data('facetid');
        const link = that.data('link');
        
        var values = [];
        var colors = [];
        var labels = [];
        Object.keys(facetdata).forEach(function(key,cnt) {
            var gray;
            if (activefacets[facetid] === undefined) 
                gray = false;
            else 
                gray = activefacets[facetid][key] ? false : true;
            if (cnt<maxValues) {
                labels.push(key);
                values.push(facetdata[key]);
                colors.push(getColor(key,gray));
            }
        });
        var piedata = {
            datasets: [{
                data: values,
                backgroundColor: colors
            }],
            labels: labels
        };
        that.append('<canvas height="'+that.attr('data-pieheight')+'" width="100%" id="canvaspublisher"/>');
        renderCanvas(piedata,link,activefacets.length);
    });
    
   
    function renderCanvas(piedata,link,active) {
    try {
        function onPieClick(event, elem) {
            if (elem[0] != undefined) {
                startNextSearch(piedata.labels[elem[0]._index]);
            }
        }

        function onLegendClick(event, elem) {
            startNextSearch(elem.text);
        };

        function startNextSearch(label) {
            const message = active ? 'Diese Filterung aufgehoben':'Suche nach Veröffentlichungen des Herausgebers „' + label + '“';
            $.toast({
                message: message, 
                timeout: 3000, 
                button: {
                    text: 'OK', // the button text, will be transformed into uppercase automatically
                }
            });
            self.location = link.replace('%25s', encodeURI(label));
        }

        var ctx = $("#canvaspublisher")[0].getContext("2d");
        var myPieChart = new Chart(ctx, {
            type: 'doughnut',
            data: piedata,
            options: {
                animation: {animateScale:true},
                legend: {
                    onClick: onLegendClick,
                    display: false,
                    position: 'bottom',
                    labels: {
                    }
                },
                onClick: onPieClick
            }
        });
        myPieChart.show();
    } catch (e) {}
    }
    function getRandomColor(grayscale) {
        var letters = '0123456789ABCDEF',
            color = '#';
        if (grayscale == true) {
          var color = ''+letters[Math.floor(Math.random() * 16)] +letters[Math.floor(Math.random() * 16)];
           return '#'+color + color+color;
        } else {
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        }
    }
    function getColor(publisher,grayscale) {
        var color = getRandomColor(grayscale);
        if (grayscale) return color;
        const MAP = {
        '^Universität Hamburg' : '#EA2221',
        'HAW Hamburg'  : '#0050AF',
        'DKRZ' : '#7BCBC7',
        'Springer' : '#031481',
        'Nomos' : '#000000',
        '^De Gruyter': '#333333',
        'VS Verlag' : '#F2861F',
        '^Georg Thieme' : '#B1E0FA',
        '^ecomed' : '#FF9216',
        '^HCU' : '#333333',
        '^Schattauer' :'#F5B300',
        '^Medizinisch W' : '#00A4D4',
        '^Kohlhammer' : '#0061A1',
        'Helmut\-Schmidt\-Universität': '#C53C5D',
        'Waxmann': '#E02129',
        'Hogrefe':'#E3E51B',
        'Beltz' : '#007ED3',
        'Oekom':'#BDD500',
        'Verlag Dr. Kova' :'#0059A4',
        'Earth System Grid':'#82ADDE',
        'Elsevier' : '#FF8100',
        'epubli' :'#6BBA48',
        'Multidisciplinary' :'#626A84',
        'DESY':'#00AEE5',
        '^LIT': '#DE2241',
        '^Kirschbaum' :'#000000',
        'Schmidt-Römhild':'#00B0EA',
        '^Stumpf': '#2C5196',
        '^Ellert':'#B96378',
        '^Mohr &': '#3055A1',
        '^Lang$' : '#2B3A8C',
        '^IEEE':'#007BB1',
        '^Vahlen' : '#0066AE',
        '^Transcript$' :'#9BB8C9',
        '^Harrassowitz$' : '#079A9D',
        '^Routledge$' : '#092097',
        '^Beck$': '#000000',
        'Technische Universität Hamburg' : '#2CD0DE'};
        Object.keys(MAP).forEach(function(key){
            if ( publisher.match(new RegExp(key))) color = MAP[key]; 
        });
        return color; 
    }
    
});
