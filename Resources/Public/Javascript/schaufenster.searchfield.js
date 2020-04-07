var FIELDS = {
    all: "in allen Daten",
    titles: 'Titel',
    authors: 'Autor/in',
      
}

function removeHiddenFacetInputs () {
    // Deselect facet if form is send
    $('.hidden_facet').remove();
}

$(function() {
    //$('.searchForm').prepend('<a href="/de/suchen-entdecken/discovery/" title="Zurück zum Start der Suche" class="bel-haus" id="home-button" onclick="self.location=\"de/suchen-entdecken/discovery/\";"> </a>')
    // inserting fieldselectbox:
    var params = getQueries();
    var needle = $('#c1-field-all').val();
    if (needle) {
       var suchURL = '?tx_find_find[q][all]=%23%23%23NEEDLE%23%23%23';
    }
    var selectedInput = params.field || 'all';
    
    /* building the SELECTOR */
    var selectHTML = '<div style="height:40px;width:200px;margin:5px 10px 0 0" class="custom-select fieldContainer fieldType-Hidden field-mode-simple">' +
        '<select id="searchfieldselector">';
    
    Object.keys(FIELDS).forEach(function(field) {
        const selected = (field == selectedInput) ? 'selected' : '';
        selectHTML += '<option value="' + field + '" ' + selected + '>' + FIELDS[field] + '</option>'
    });
    selectHTML += '</select></div>';
    /* ------ */
    //$('.formFields .fieldContainer label').hide();
    $('.controls').prepend(selectHTML);
    $('.submit').attr('value', 'Suche starten');
    $('#searchfieldselector').on('change', function(evt, item) {
        selectedInput = this.value;
        renderInputFields();
        removeHiddenFacetInputs();
    });
    renderInputFields();

    $('.inputType-text').on('change', function () {
        removeHiddenFacetInputs();
    });

    function renderInputFields() {
        $('.formFields .inputType-text').each(function() {
            var that = $(this);
            that.attr('placeholder', 'Suchtext  hier eingeben …');
            that.show();
            const regex = new RegExp('-field-'+selectedInput+'$');
            if (that.attr('id').match(regex)) { 
                that.show();
            } else {
                that.hide();
                that.val('');
            }
        });
    }

    function getQueries() {
        var REGEX = /^tx_find_find%5Bq%5D%5B(.*?)%5D/;
        var res = {};
        var href = window.location.href.replace(/#.*/, '');
        var hashes = href.slice(href.indexOf('?') + 1).split('&');
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            var key = hash[0];
            var match = key.match(REGEX);
            if (match && hash[1] != "") {
                res = {
                    field: match[1],
                    value: hash[1]
                };
            }
        }
        return res;
    }
    
    // https://www.w3schools.com/howto/howto_custom_select.asp
    var x, i, j, selElmnt, a, b, c;
    /*look for any elements with the class "custom-select":*/
    x = document.getElementsByClassName("custom-select");
    for (i = 0; i < x.length; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        /*for each element, create a new DIV that will act as the selected item:*/
        a = document.createElement("DIV");
        a.setAttribute("class", "select-selected");
        a.setAttribute("data-value", "");
        a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
        x[i].appendChild(a);
        /*for each element, create a new DIV that will contain the option list:*/
        b = document.createElement("DIV");
        b.setAttribute("class", "select-items select-hide");

        /* Reaction on click */
        for (j = 0; j < selElmnt.length; j++) {
            /*for each option in the original select element,
            create a new DIV that will act as an option item:*/
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            var key = selElmnt.options[j].getAttribute("value");
            c.setAttribute("data-value", key);
            c.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
                and the selected item:*/
                var y, i, k, s, h;
                selectedInput = e.target.getAttribute("data-value");
                renderInputFields();
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                h = this.parentNode.previousSibling;
                for (i = 0; i < s.length; i++) {
                    if (s.options[i].innerHTML == this.innerHTML) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        for (k = 0; k < y.length; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        break;
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        a.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
            and open/close the current select box:*/
            e.stopPropagation();
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
        });
    }

    function closeAllSelect(elmnt) {
        /*a function that will close all select boxes in the document,
        except the current select box:*/
        var x, y, i, arrNo = [];
        x = document.getElementsByClassName("select-items");
        y = document.getElementsByClassName("select-selected");
        for (i = 0; i < y.length; i++) {
            if (elmnt == y[i]) {
                arrNo.push(i)
            } else {
                y[i].classList.remove("select-arrow-active");
            }
        }
        for (i = 0; i < x.length; i++) {
            if (arrNo.indexOf(i)) {
                x[i].classList.add("select-hide");
            }
        }
    }
    /*if the user clicks anywhere outside the select box,
    then close all select boxes:*/
    document.addEventListener("click", closeAllSelect);

});


$.toast = function(obj) {
    obj.button = obj.button || {}
    obj.timeout = obj.timeout || 4000

    var $toast = $('<div/>')
    $toast.addClass('toast')

    function close() {
        $toast.removeClass('toast--shown')
        if (obj.onclose) obj.onclose()
    }
    $toast.html('<div class="toast-text">' + obj.message + '</div>')
    if (obj.button) {
        var $toastButton = $('<div/>')
        $toastButton.addClass('toast-button btn')
        $toastButton.html(obj.button.text)
        $toast.prepend($toastButton)
        if (obj.button.onclick) {
            $toastButton.click(function() {
                obj.button.onclick()

                if (!obj.preventClose) {
                    close()
                }
            })
        }
    }

    $toast.prepend('<div class="toast-close">&#10005;</div>')
    $('body').append($toast)
    setTimeout(function() {
        $toast.addClass('toast--shown')
    }, 0)
    $('.toast .toast-close').click(function() {
        close()
    })

    if (obj.timeout) {
        setTimeout(close, obj.timeout)
    }
}
