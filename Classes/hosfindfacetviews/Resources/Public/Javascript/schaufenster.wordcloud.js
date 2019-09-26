! function(jQuery) {
		var words=[];
		var link;
		function getWords(foo, max) {
			var words = [];
			Object.keys(foo).forEach(function(w,i){
			    if (i<max && w) {
			    	words.push({
			    		text : w,
			    		size : foo[w]
			    	});
			    } 		
			});
			return words;
		}
                
		$(function() {
			$('.WordcloudContainer').each(function(){
				const words = getWords($(this).data('clouddata'),$(this).data('maxvalues'));
				link= $(this).data('link'); // for bigcloud 
				$(this).append('<a href="javascript:"><div id="wordcloud" height="160" width="100%" /></a>');
				d3.wordcloud().size([280, 200]).font($(this).data('fontfamily'))
					.selector('#wordcloud')
					.words(words)
					.onwordclick(openBigBubble)
					.start();
		// https://github.com/wvengen/d3-wordcloud
		function openBigBubble(d, i) {
			var W = ($(window).width() - 300) * 0.95,
			    H = $(window).height() * 0.9;
			$('#wordcloud').webuiPopover({
//				title : "Schlagworte",
				placement : "right",
				type : 'iframe',
				width : W,
				height : H,
				url : '/typo3conf/ext/hosfindfacetviews/Resources/Public/Javascript/wordcloud.html?'+ Math.random(),
				animation : 'pop',
				onShow : function(e) {
					$("iframe").each(function() {
						$(this).one("load", function(){
						var that =  $(this)[0];
						setTimeout(function(){
						that.contentWindow.startRendering(words, link);},2);
					        });
					});
				}
			});
		};

			});
			
		});

	}(jQuery);
