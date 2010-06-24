// written by eric hynds (erichynds.com)

(function($, _domManip){
	var selectors = [], guid = 0;

	$.event.special.create = {
		add: function( data ){
			selectors.push( data.selector );
		},
		
		// won't fire in 1.4.2 http://dev.jquery.com/ticket/6202
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

	$.fn.domManip = function(args, table, callback){
		var value = args[0], matches = [], nodes = arguments[0], numSelectors = selectors.length, gen = [], html = $(), node;
		
		// if no create events are bound, just fire the original domManip method 
		if( !numSelectors ){
			return _domManip.apply(this, arguments);
		}
		
		// from the original $.fn.domManip, deal with function values
		if ( $.isFunction(value) ){
			return this.each(function(i){
				var self = $(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}
		
		// crawl through the html structure passed in looking for matching elements
		for( var i=0, len=nodes.length; i<len; i++ ){
			node = $(nodes[i]);
			
			(function walk( element ){
				element = element || node[0].parentNode;
				var cur = (element ? element.firstChild : node[0]);
				
				while(cur !== null){
					for( var x=0; x<numSelectors; x++ ){
						if( $(cur).is(selectors[x]) ){
							if( !cur.id ){
								cur.id = "jqcreateevt"+(++guid);
								gen.push(cur.id); // remember that this ID was generated
							}
							
							// remember this match
							matches.push(cur.id);
						}
					}
				
					walk( cur );
					cur = cur.nextSibling;
				}
			})();
			
			// the html we started with, but with ids attached to the elements
			// bound with create.
			html = html.add(node);
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
			
			// double check to make sure the event hasn't already fired.
			// can happen with wrap()
			if( !$elem.data("jqcreateevt") ){
				$elem.trigger("create").data("jqcreateevt", true);
			}
		});
		
		return ret;
	};
	
})(jQuery, jQuery.fn.domManip);
