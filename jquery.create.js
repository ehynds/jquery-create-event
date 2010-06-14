// written by eric hynds (erichynds.com)

(function($, _domManip){
	var selectors = [];

	$.event.special.create = {
		add: function( data ){
			selectors.push( data.selector );
		},
		
		// won't fire in 1.4.2, but that's ok http://dev.jquery.com/ticket/6202
		remove: function( data ){
			var len = selectors.length;
		
			while(len--){
				if(selectors[len] === data.selector){
					selectors.splice(len, 1);
					break;
				}
			}
		}
	};

	$.fn.domManip = function(){
		var matches = [], nodes = arguments[0], numSelectors = selectors.length, guid = 0, gen = [], html;
		
		// if no create events are bound, just fire the original domManip method 
		if( !numSelectors ){
			return _domManip.apply(this, arguments);
		}
		
		for( var i=0, len=nodes.length; i<len; i++ ){
			html = $(nodes[i]);
			
			(function walk( element ){
				element = element || html[0].parentNode;
				var cur = (element ? element.firstChild : html[0]);
					
				while(cur !== null){
					for( var x=0; x<numSelectors; x++ ){
						if( $(cur).is(selectors[x]) ){
							if( !cur.id ){
								cur.id = "jqcreateevt"+(++guid);
								gen.push(cur.id); // remember this ID was generated
							}
							
							matches.push( cur.id );
						}
					}
				
					walk( cur );
					cur = cur.nextSibling;
				}
			})();
		}
		
		// overwrite the passed in html with the new html
		arguments[0] = html;
		
		// inject elems into DOM
		var ret = _domManip.apply(this, arguments);
	
		$.each(matches, function(i,id){
			var $elem = $(document.getElementById(id));
			
			// cleanup generated IDs
			if( $.inArray(id, gen) !== -1 ){
				$elem.removeAttr("id");
			}
			
			$elem.trigger("create");
		});
		
		return ret;
	};
	
})(jQuery, jQuery.fn.domManip);
