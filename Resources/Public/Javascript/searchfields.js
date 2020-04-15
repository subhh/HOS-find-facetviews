$( document ).ready(function() {

    // url parameter function
    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = window.location.search.substring(1),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
            }
        }
    };

    // change name attribute
    $('#combinedSelectField').on('change', function (event) {
        $('#combinedTextField').attr('name', 'q[' + $(this).val() + ']');
        removeHiddenFacetInputs();
    });

    // refill search form with last search
    var selectField, searchTerm;
    selectField = getUrlParameter('tx_find_find%5BsearchFieldSelection%5D');
    searchTerm = getUrlParameter('q%5B' + selectField + '%5D');

    if (selectField && searchTerm) {
        $('#combinedTextField').attr('name', 'q[' + selectField + ']').val(searchTerm);
        $('#combinedSelectField').val(selectField);
    }

});

function removeHiddenFacetInputs() {
    // Deselect facet if form is send
    $('.hidden_facet').remove();
}