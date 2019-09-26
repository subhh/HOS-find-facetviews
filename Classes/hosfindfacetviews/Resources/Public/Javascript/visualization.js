/* eslint-disable no-undef */

;(function() {
  const appSource = '/discovery/raw/',appTarget = '#content';

  // private, static functions:
  const remapPath = foo => {return foo.replace(window.location.pathname, appSource);};
  const loadScripts = s => {
    s.forEach(({ src, textContent }) => {
      if (src) {
        $('head').append('<script src="'+ remapPath(src) + '"/>')
      } else {
        $('head').append('<script>' + textContent + '</script>')
      }
    })
  };

  // request static app and extract assets
  $.get(appSource, function(html) {
    const domlist = $(html)
    const tags = Object.values(domlist)
    const styles = tags.filter(
      ({ tagName, rel }) => tagName === 'LINK' && rel === 'stylesheet'
    )
    const scripts = tags.filter(({ tagName }) => tagName === 'SCRIPT')
    $(function() {
      const stylesCount = document.styleSheets.length
      // add app container element
      $(appTarget).append('<div id="root"></div>')
      // load external stylesheets
      styles.forEach(({ href }, i) => {
        // append stylesheet to head
        $('<link />', {
          rel: 'stylesheet',
          href : remapPath(href),
          onload: () => {
            console.log(`${href} loaded (${document.styleSheets.length})`)
          },
        }).appendTo('head')
      })
      // wait until stylesheets have been applied
      const ti = setInterval(function() {
        if (document.styleSheets.length >= styles.length + stylesCount) {
          clearInterval(ti)
          loadScripts(scripts)
        }
      }, 200)
    })
  })
})()
