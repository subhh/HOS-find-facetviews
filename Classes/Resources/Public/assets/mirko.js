const URL='/mirko/raw/',  // da kommt es her
      ELEM='#c15';    // da soll es hin

$.get(URL,function(html){
    const domlist = $(html);
    Object.keys(domlist).forEach(function(i){
        const elem = $(domlist[i]);
        switch (elem.prop("tagName")) {
            case 'SCRIPT':
                const src = elem.attr('src');
                if (src) { // remote JS with src attribute
                    $('head').append('<script src="' + elem.attr('src')+ '"/>');
                } else {   // embeded JS (now in head)
                   $('head').append('<script>'+elem.text()+'</script>');
 
                }                
            break;
            case 'LINK':
                switch (elem.attr('rel')) {
                    case 'stylesheet':
                    $('head').append('<link rel="stylesheet" href="' + elem.attr('href') + '" />');
                    break;
                    case 'manifest': 
                     $('head').append('<link rel="manifest" href="' + elem.attr('href') + '" />');
                    break;
                }
            break;
            case 'DIV':
                $(ELEM).html(elem);
            break; 
        }
    });
});