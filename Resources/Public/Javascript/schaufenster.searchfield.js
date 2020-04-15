
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
