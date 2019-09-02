/* eslint-disable no-undef */

;(function() {
  const EP = 'https://hosdev.sub.uni-hamburg.de';
  const appSource = EP + '/discovery/raw';
  const URL = {
    foo : EP + '/de/suchen-entdecken/visualization',
    bar : appSource 
 }; 
  const appTarget = '#content';


  const loadScripts = function(s) {
    console.log(s);
    s.forEach(({ src, textContent }) => {
      if (src) {
        src= src.replace(URL.foo,URL.bar);
        console.log("SRC="+src);
        $('head').append('<script src="${src}"/>')
      } else {
        $('head').append('<script>${textContent}</script>')
      }
    })
  }

  // request static app and extract assets
  $.get(appSource, function(html) {
    const domlist = $(html)
    const tags = Object.values(domlist)
    const styles = tags.filter(
      ({ tagName, rel }) => tagName === 'LINK' && rel === 'stylesheet'
    )
    const scripts = tags.filter(({ tagName }) => tagName === 'SCRIPT')
    $(document).ready(function() {
      const stylesCount = document.styleSheets.length
      // add app container element
      $(appTarget).append('<div id="root"></div>')
      // load external stylesheets
      styles.forEach(({ href }, i) => {
        // append stylesheet to head
        $('<link />', {
          rel: 'stylesheet',
          href: href.replace(URL.foo,URL.bar),
          onload: () => {
            console.log(`${href} loaded (${document.styleSheets.length})`)
          },
        }).appendTo('head')
      })
      console.log("wait for renderer");
      // wait until stylesheets have been applied
      const ti = setInterval(function() {
        if (document.styleSheets.length >= styles.length + stylesCount) {
          clearInterval(ti)
          console.log(scripts);
          loadScripts(scripts)
        }
      }, 200)
    })
  })
})()
